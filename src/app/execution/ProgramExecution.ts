import { derived, Readable, Writable, writable } from "../util/customStores"
import Action from "./actions/Action"
import { instructionToActions } from "./actions/instructionToActionConverter"
import { LAST_ADDRESS } from "../util/ram"
import { messageFeedStore } from "../store/state"
import { FETCH, INCREMENT_PC } from "./actions/presets"
import logger, { LogCategory } from "../util/logger"
import { Cyclable } from "./NonBlockingLoop"
import Cpu from "../model/Cpu"
import { ExecutionContext } from "./ExecutionContext"
import Ram from "../model/Ram"
import SymbolTable from "../model/SymbolTable"
import Wires from "../model/Wires"

// Note: it could be possible that the execution of the actions could be implemented without an infinite non-blocking loop. An analysis should be made. Could improve performance / be more elegant

/** A function that can be executed at specific points of the execution */
export type ExecutionCallback = (ctx: ExecutionContext) => void

/** All the phases of an instruction execution cycle */
type CyclePhase =
	| "ENQUEUING_FETCH"
	| "EXECUTING_FETCH"
	| "ENQUEUING_INSTRUCTION"
	| "EXECUTING_INSTRUCTION"
	| "ENQUEUEING_PC_INCREMENT"
	| "EXECUTING_PC_INCREMENT"

/** Implements the flow of the program's execution */
export default class ProgramExecution implements Cyclable {
	/** Read-only store that is set to true when the program execution is executing */
	public readonly isExecuting: Readable<boolean>
	/** Writable store to which the public read-only isExecuting store value is binded */
	protected _isExecuting: Writable<boolean>
	/** Set to true when the execution should execute until an error occurs or the end of the program is reached */
	protected isPlayingProgram: boolean
	/** Set to true when the execution should execute just a micro step */
	protected isPlayingMicrostep: boolean
	/** Set to true when the execution should execute just an instruction */
	protected isPlayingInstruction: boolean
	/** The phase of the instruction execution cycle */
	protected cyclePhase: CyclePhase
	/** The queue that contains the actions to be executed */
	protected queue: Action[]
	/** Object that allows actions to access the simulator components  */
	public executionContext: ExecutionContext
	/** Callbacks executed when the execution is paused */
	protected executionEndedCallbacks: ExecutionCallback[]

	/**
	 * @param cpu - Reference to the cpu used to perform the actions
	 * @param ram - Reference to the ram used to perform the actions
	 * @param symbolTable - Reference to the symbol table used to perform the actions
	 * @param wires - Reference to the wires used to perform the actions
	 */
	constructor(cpu: Cpu, ram: Ram, symbolTable: SymbolTable, wires: Wires) {
		if (!cpu) throw new Error("Null or undefined cpu")
		if (!ram) throw new Error("Null or undefined ram")
		if (!symbolTable) throw new Error("Null or undefined symbolTable")
		if (!wires) throw new Error("Null or undefined wires")
		this._isExecuting = writable(false)
		this.isExecuting = derived(this._isExecuting, value => value)
		this.isPlayingProgram = false
		this.isPlayingMicrostep = false
		this.isPlayingInstruction = false
		this.cyclePhase = "ENQUEUING_FETCH"
		this.queue = []
		this.executionContext = {
			cpu: {
				model: cpu,
				component: null // will be set when application mounts
			},
			ram: {
				model: ram,
				component: null // will be set when application mounts
			},
			wires: {
				model: wires,
				component: null // will be set when application mounts
			},
			symbolTable,
			stepTextComponent: null // will be set when application mounts
		}
		this.executionEndedCallbacks = []
	}

	async cycle(): Promise<void> {
		if (!this.shouldExecute()) {
			return
		}
		try {
			switch (this.cyclePhase) {
				case "ENQUEUING_FETCH":
					this.queue.push(...FETCH)
					this.cyclePhase = "EXECUTING_FETCH"
					break
				case "EXECUTING_FETCH":
					await this.execute()
					if (this.queueIsEmpty()) {
						this.cyclePhase = "ENQUEUING_INSTRUCTION"
					}
					break
				case "ENQUEUING_INSTRUCTION":
					const ir = this.executionContext.cpu.model.instructionRegister.get()
					this.queue.push(...instructionToActions(ir))
					logger.debug(`Executing instruction "${ir.symbolic()}"`, LogCategory.EXECUTION)
					this.cyclePhase = "EXECUTING_INSTRUCTION"
					break
				case "EXECUTING_INSTRUCTION":
					await this.execute()
					if (this.queueIsEmpty()) {
						if (
							this.executionContext.cpu.model.programCounter.get().unsigned() === LAST_ADDRESS &&
							!this.executionContext.cpu.model.isJumping.get()
						) {
							this.executionContext.cpu.model.isHalting.set(true)
						}
						if (this.executionContext.cpu.model.isJumping.get()) {
							this.executionContext.cpu.model.isJumping.set(false)
							this.cyclePhase = "ENQUEUING_FETCH"
							if (this.isPlayingInstruction) {
								this.setIsPlayingInstruction(false)
							}
						} else {
							this.cyclePhase = "ENQUEUEING_PC_INCREMENT"
						}
					}
					break
				case "ENQUEUEING_PC_INCREMENT":
					this.queue.push(...INCREMENT_PC)
					this.cyclePhase = "EXECUTING_PC_INCREMENT"
					break
				case "EXECUTING_PC_INCREMENT":
					await this.execute()
					if (this.isPlayingInstruction) {
						this.setIsPlayingInstruction(false)
						this.executionContext.cpu.model.isHalting.set(true)
					}
					if (this.queueIsEmpty()) {
						this.cyclePhase = "ENQUEUING_FETCH"
					}
					break
			}
		} catch (error) {
			this.executionContext.cpu.model.isHalting.set(true)
			messageFeedStore.get().error(error.message)
			logger.handled_error(error.message, LogCategory.EXECUTION)
		} finally {
			if (this.executionContext.cpu.model.isHalting.get()) {
				this.reset()
			}
		}
	}

	/** Execute the actions in queue */
	protected async execute(): Promise<void> {
		while (!this.queueIsEmpty() && this.shouldExecute()) {
			const action = this.queue.shift()!
			await action.execute(this.executionContext)
			if (this.isPlayingMicrostep && action.doesEndStep()) {
				this.setIsPlayingMicrostep(false)
			}
		}
	}

	/** Start the execution of the program. The program will stop only if it encounters an error, reaches its end or the execution is paused */
	public start(...executionEndedCallbacks: ExecutionCallback[]): void {
		this.executionEndedCallbacks.push(...executionEndedCallbacks)
		this.setIsPlayingProgram(true)
		this.setIsPlayingMicrostep(false)
		this.setIsPlayingInstruction(false)
		logger.debug("Execution - START", LogCategory.EXECUTION)
	}

	/** Pauses the execution of the program */
	public pause(): void {
		this.setIsPlayingProgram(false)
		this.setIsPlayingMicrostep(false)
		this.setIsPlayingInstruction(false)
		this.executeExecutionEndedCallbacks()
		logger.debug("Execution - PAUSE", LogCategory.EXECUTION)
	}

	/** Toggles the state of the execution between executing and paused */
	public toggle(...executionEndedCallbacks: ExecutionCallback[]): void {
		if (!this.isExecuting.get()) {
			this.start(...executionEndedCallbacks)
		} else {
			this.pause()
		}
	}

	/** Executes a single microstep */
	public step(...executionEndedCallbacks: ExecutionCallback[]): void {
		this.executionEndedCallbacks.push(...executionEndedCallbacks)
		this.setIsPlayingProgram(false)
		this.setIsPlayingMicrostep(true)
		this.setIsPlayingInstruction(false)
		logger.debug("Execution - STEP", LogCategory.EXECUTION)
	}

	/** Executes a single instruction */
	public instruction(...executionEndedCallbacks: ExecutionCallback[]): void {
		this.executionEndedCallbacks.push(...executionEndedCallbacks)
		this.setIsPlayingProgram(false)
		this.setIsPlayingMicrostep(false)
		this.setIsPlayingInstruction(true)
		logger.debug("Execution - INSTRUCTION", LogCategory.EXECUTION)
	}

	/** Pauses and reset the execution. All actions ready to be executed won't be executed */
	public reset(): void {
		this.pause()
		this.executionContext.cpu.model.isHalting.set(false)
		this.executionContext.cpu.model.isJumping.set(false)
		this.cyclePhase = "ENQUEUING_FETCH"
		this.emptyExecutionQueue()
		logger.debug("Execution - RESET", LogCategory.EXECUTION)
	}

	/** Returns true if the execution should execute actions */
	protected shouldExecute(): boolean {
		return this.isPlayingProgram || this.isPlayingMicrostep || this.isPlayingInstruction
	}

	/** Empties the execution queue */
	protected emptyExecutionQueue() {
		this.queue = []
	}

	/** Returns true if the execution queue is empty */
	protected queueIsEmpty(): boolean {
		return this.queue.length === 0
	}

	/** Sets the isPlayingProgram variable and updates the isExecuting store */
	protected setIsPlayingProgram(value: boolean): void {
		this.isPlayingProgram = value
		this._isExecuting.set(this.isPlayingProgram || this.isPlayingMicrostep || this.isPlayingInstruction)
	}

	/** Sets the isPlayingMicrostep variable and updates the isExecuting store */
	protected setIsPlayingMicrostep(value: boolean): void {
		this.isPlayingMicrostep = value
		this._isExecuting.set(this.isPlayingProgram || this.isPlayingMicrostep || this.isPlayingInstruction)
	}

	/** Sets the isPlayingInstruction variable and updates the isExecuting store */
	protected setIsPlayingInstruction(value: boolean): void {
		this.isPlayingInstruction = value
		this._isExecuting.set(this.isPlayingProgram || this.isPlayingMicrostep || this.isPlayingInstruction)
	}

	/** Executes all the executionEndedCallbacks, called each time the execution is paused */
	protected executeExecutionEndedCallbacks(): void {
		this.executionEndedCallbacks.forEach(callback => callback(this.executionContext))
		this.executionEndedCallbacks = []
	}
}
