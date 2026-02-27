import { ActionType } from "$lib/types/action"
import { ExecutionStep, ExecutionSteppingMode as SteppingMode } from "$lib/types/execution"
import { unreachable } from "$lib/util/development"
import type { StartStepAction } from "./action/execution"
import type { ActionHandler, SubmitTasksFunction } from "./action_handler"
import type { ActionHandlerFor } from "./actions"
import { FETCH_AND_DECODE_ACTIONS } from "./steps_actions"
import { Action, AtomicActionGroup, type Task } from "./task"

/** {@link ActionHandler} indexed by the {@link ActionType} they handle */
export type ActionHandlersMapping = {
	[T in MappableActions]: ActionHandlerFor<T>
}

/** All of the actions that can be mapped to an handler */
export type MappableActions = Exclude<
	ActionType,
	| typeof ActionType.START_STEP
	| typeof ActionType.END_STEP
	| typeof ActionType.END_INSTRUCTION
	| typeof ActionType.END_PROGRAM
>

/** {@link ActionHandler} indexed by the {@link ActionType} they handle */
type _ActionHandlersMapping = {
	[T in ActionType]: ActionHandlerFor<T>
}

/** Execution controller for the simulator.
 * Allows for:
 * - Executing actions in a loop without blocking the execution of other code (through the use of javascript macrotasks)
 * - Starting/pausing/resuming/resetting the execution of the program
 * - Controlling if the execution should pause at each step or instruction */
export class Execution {
	/** Wether the program is executing or not */
	private _isExecuting: boolean
	/** The stepping mode currently selected */
	private _steppingMode: SteppingMode
	/** The currently executing step or null if execution was resetted */
	private _step: ExecutionStep | null
	/** The FIFO queue of tasks that are scheduled for execution */
	private taskQueue: Task[]
	/** ID of the javascript macrotask that will execute the next task in queue */
	private macrotaskID: number
	/** All the action handlers available, indexed by their action types */
	private readonly actionHandlers: _ActionHandlersMapping
	/** Instance of a {@link SubmitTasksFunction} that will be passed to the action handlers when invoked.
	 * Stored in a variable so that it will be created just once */
	private readonly submitTasksFunc: SubmitTasksFunction

	constructor(actionHandlers: ActionHandlersMapping) {
		this._isExecuting = $state(false)
		this._steppingMode = $state(SteppingMode.PROGRAM)
		this._step = $state(null)
		this.taskQueue = []
		this.macrotaskID = -1
		this.actionHandlers = {
			...actionHandlers,
			[ActionType.START_STEP]: {
				handle: this.handleStartStepAction.bind(this),
				get actionType(): ActionType {
					return ActionType.START_STEP
				},
			},
			[ActionType.END_STEP]: {
				handle: this.handleEndStepAction.bind(this),
				get actionType(): ActionType {
					return ActionType.END_STEP
				},
			},
			[ActionType.END_INSTRUCTION]: {
				handle: this.handleEndInstructionAction.bind(this),
				get actionType(): ActionType {
					return ActionType.END_INSTRUCTION
				},
			},
			[ActionType.END_PROGRAM]: {
				handle: this.handleEndProgramAction.bind(this),
				get actionType(): ActionType {
					return ActionType.END_PROGRAM
				},
			},
		}
		this.submitTasksFunc = (...newTasks) => this.taskQueue.push(...newTasks)
	}

	/** Wether the program is executing or not */
	get isExecuting(): boolean {
		return this._isExecuting
	}

	/** The stepping mode currently selected */
	get steppingMode(): SteppingMode {
		return this._steppingMode
	}

	/** The currently executing step or null if execution was resetted */
	get step(): ExecutionStep | null {
		return this._step
	}

	/** Start/resume the execution with the specified stepping mode */
	play(steppingMode: SteppingMode): void {
		this._steppingMode = steppingMode
		this.start()
		// WARN: Make sure that using the length of the task queue doesn't cause bugs.
		// Is there a situation when the task queue is empty but the execution is not
		// at the start of a new instruction?
		// Maybe just to be sure i should store this information in a variable
		if (this.taskQueue.length === 0) {
			this.taskQueue.push(...FETCH_AND_DECODE_ACTIONS)
		}
	}

	/** Start/resume the execution with the {@link SteppingMode.PROGRAM} stepping mode */
	playProgram(): void {
		this.play(SteppingMode.PROGRAM)
	}

	/** Start/resume the execution with the {@link SteppingMode.INSTRUCTION} stepping mode */
	playInstruction(): void {
		this.play(SteppingMode.INSTRUCTION)
	}

	/** Start/resume the execution with the {@link SteppingMode.STEP} stepping mode */
	playStep(): void {
		this.play(SteppingMode.STEP)
	}

	/** Pause the execution.
	 * The Pausing of any animations that are currently playing is handled externally */
	pause(): void {
		this.stop()
	}

	/** Stop and reset the execution to the start of a new fetch-decode-execute cycle.
	 * The canceling of any animations that are currently playing is handled externally */
	reset(): void {
		this.stop()
		this.taskQueue = []
		this._step = null
	}

	/** Log all the currently scheduled tasks to the console */
	debugTasks(): void {
		let taskIndex = 0
		for (const task of this.taskQueue) {
			if (task instanceof Action) {
				console.debug(`${taskIndex.toString().padStart(3)} - ${task.toString()}`)
			} else if (task instanceof AtomicActionGroup) {
				console.group(`${taskIndex.toString().padStart(3)} - ${task.toString()}`)
				for (const action of task.actions) {
					console.debug(action.toString())
				}
				console.groupEnd()
			} else {
				unreachable()
			}
			taskIndex += 1
		}
	}

	/** Start the execution */
	private start(): void {
		if (this._isExecuting) {
			return
		}
		this._isExecuting = true
		this.submitJavascriptMacrotask()
	}

	/** Stop the execution */
	private stop(): void {
		if (!this._isExecuting) {
			return
		}
		this._isExecuting = false
		this.cancelJavascriptMacrotask()
	}

	/** Schedule the execution of the next task as a javascript macrotask */
	private submitJavascriptMacrotask(): void {
		this.macrotaskID = setTimeout(this.macrotask, 0, this)
	}

	/** Cancel the javascript macrotask responsible for executing the next task */
	private cancelJavascriptMacrotask(): void {
		clearTimeout(this.macrotaskID)
		this.macrotaskID = -1
	}

	/** The recursive function that will be scheduled as a javascript macrotask */
	private async macrotask(): Promise<void> {
		if (!this._isExecuting) {
			return
		}
		await this.executeNextTask()
		if (this._isExecuting) {
			this.submitJavascriptMacrotask()
		}
	}

	/** Execute the next task in the task queue */
	private async executeNextTask(): Promise<void> {
		const nextTask = this.taskQueue.shift()!
		if (nextTask instanceof Action) {
			await this.executeAction(nextTask)
			return
		}
		if (nextTask instanceof AtomicActionGroup) {
			for (const action of nextTask.actions) {
				await this.executeAction(action)
			}
			return
		}
		unreachable()
	}

	/** Execute the provided action */
	private async executeAction(action: Action): Promise<void> {
		try {
			const handler = this.actionHandlers[action.actionType] as ActionHandler<Action>
			await handler.handle(action, this.submitTasksFunc)
		} catch (error: unknown) {
			unreachable(
				`An error was thrown by an action handler.\n\tAction: ${action.toString()}\n\tError: ${error}`,
			)
		}
	}

	/** {@link ActionHandler} for {@link StartStepAction} */
	private handleStartStepAction(action: StartStepAction): void {
		this._step = action.step
	}

	/** {@link ActionHandler} for {@link EndStepAction} */
	private handleEndStepAction(): void {
		if (this._steppingMode === SteppingMode.STEP) {
			this.stop()
		}
	}

	/** {@link ActionHandler} for {@link EndInstructionAction} */
	private handleEndInstructionAction(): void {
		if (this._steppingMode !== SteppingMode.PROGRAM) {
			this.stop()
		}
	}

	/** {@link ActionHandler} for {@link EndProgramAction} */
	private handleEndProgramAction(): void {
		this.stop()
	}
}
