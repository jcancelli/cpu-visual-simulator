import { derived, Readable, Writable, writable } from "../util/customStores"
import Action from "./actions/Action"
import { instructionToActions } from "./actions/instructionToActionConverter"
import { LAST_ADDRESS } from "../util/ram"
import { messageFeed as messageFeedComponent } from "../store/components"
import { FETCH, INCREMENT_PC } from "./actions/presets"
import Logger from "../util/logger"
import { Cyclable } from "./NonBlockingLoop"
import Cpu from "../model/Cpu"

// Note: it could be possible that the execution of the actions could be implemented without an infinite non-blocking loop. An analysis should be made. Could improve performance / be more elegant

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
	/** Reference to the Cpu on which the actions will be executed */
	protected cpu: Cpu

	/**
	 * @param {Cpu} cpu - A reference to the Cpu on which the execution will perform actions on
	 */
	constructor(cpu: Cpu /*, ram: Ram, logger: Logger, messageFeed: MessageFeed*/) {
		if (!cpu) {
			throw new Error("Null or undefined cpu")
		}
		this._isExecuting = writable(false)
		this.isExecuting = derived(this._isExecuting, value => value)
		this.isPlayingProgram = false
		this.isPlayingMicrostep = false
		this.isPlayingInstruction = false
		this.cyclePhase = "ENQUEUING_FETCH"
		this.queue = []
		this.cpu = cpu
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
					const ir = this.cpu.instructionRegister.get()
					this.queue.push(...instructionToActions(ir))
					Logger.info(`Executing instruction "${ir.symbolic()}"`, "EXECUTION")
					this.cyclePhase = "EXECUTING_INSTRUCTION"
					break
				case "EXECUTING_INSTRUCTION":
					await this.execute()
					if (this.queueIsEmpty()) {
						if (this.cpu.programCounter.get().unsigned() === LAST_ADDRESS && !this.cpu.isJumping.get()) {
							this.cpu.isHalting.set(true)
						}
						if (this.cpu.isJumping.get()) {
							this.cpu.isJumping.set(false)
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
						this.cpu.isHalting.set(true)
					}
					if (this.queueIsEmpty()) {
						this.cyclePhase = "ENQUEUING_FETCH"
					}
					break
			}
		} catch (error) {
			this.cpu.isHalting.set(true)
			messageFeedComponent.get().error(error.message)
			Logger.error(error, "EXECUTION", error.isChecked)
		} finally {
			if (this.cpu.isHalting.get()) {
				this.reset()
			}
		}
	}

	/** Execute the actions in queue */
	protected async execute(): Promise<void> {
		while (!this.queueIsEmpty() && this.shouldExecute()) {
			const action = this.queue.shift()!
			await action.execute()
			if (this.isPlayingMicrostep && action.doesEndStep()) {
				this.setIsPlayingMicrostep(false)
			}
		}
	}

	/** Start the execution of the program. The program will stop only if it encounters an error, reaches its end or the execution is paused */
	public start(): void {
		this.setIsPlayingProgram(true)
		this.setIsPlayingMicrostep(false)
		this.setIsPlayingInstruction(false)
		Logger.info("Execution - START", "EXECUTION")
	}

	/** Pauses the execution of the program */
	public pause(): void {
		this.setIsPlayingProgram(false)
		this.setIsPlayingMicrostep(false)
		this.setIsPlayingInstruction(false)
		Logger.info("Execution - PAUSE", "EXECUTION")
	}

	/** Toggles the state of the execution between executing and paused */
	public toggle(): void {
		if (!this.isExecuting.get()) {
			this.start()
		} else {
			this.pause()
		}
	}

	/** Executes a single microstep */
	public step(): void {
		this.setIsPlayingProgram(false)
		this.setIsPlayingMicrostep(true)
		this.setIsPlayingInstruction(false)
		Logger.info("Execution - STEP", "EXECUTION")
	}

	/** Executes a single instruction */
	public instruction(): void {
		this.setIsPlayingProgram(false)
		this.setIsPlayingMicrostep(false)
		this.setIsPlayingInstruction(true)
		Logger.info("Execution - INSTRUCTION", "EXECUTION")
	}

	/** Pauses and reset the execution. All actions ready to be executed won't be executed */
	public reset(): void {
		this.pause()
		this.cpu.isHalting.set(false)
		this.cpu.isJumping.set(false)
		this.cyclePhase = "ENQUEUING_FETCH"
		this.emptyExecutionQueue()
		Logger.info("Execution - RESET", "EXECUTION")
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
}
