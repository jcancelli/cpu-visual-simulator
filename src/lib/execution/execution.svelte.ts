import { ACTION_TYPES, ActionType, type ExecutionControlActionType } from "$lib/types/action"
import { ExecutionSteppingMode as SteppingMode } from "$lib/types/execution"
import { unreachable } from "$lib/util/development"
import type { ActionHandler, SubmitTasksFunction } from "./action_handler"
import type { ActionHandlerFor } from "./actions"
import { Action, ActionGroup, type Task } from "./task"

/** {@link ActionHandler|Action handlers} indexed by the {@link ActionType|action type} they handle
 * except actions that control the flow of execution */
export type ActionHandlersMap = {
	[T in Exclude<ActionType, ExecutionControlActionType>]?: ActionHandlerFor<T>[]
}

/** {@link ActionHandler|Action handlers} indexed by the {@link ActionType|action type} they handle */
type ActionHandlers = {
	[T in ActionType]: ActionHandler<Action>[]
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
	/** The FIFO queue of tasks that are scheduled for execution */
	private taskQueue: Task[]
	/** ID of the javascript macrotask that will execute the next task in queue */
	private macrotaskID: number
	/** All the action handlers available, indexed by their action types */
	private readonly actionHandlers: ActionHandlers
	/** Instance of a {@link SubmitTasksFunction} that will be passed to the action handlers when invoked.
	 * Stored in a variable so that it will be created just once */
	private readonly submitTasksFunc: SubmitTasksFunction

	constructor(actionHandlers: ActionHandlersMap) {
		this._isExecuting = $state(false)
		this._steppingMode = $state(SteppingMode.PROGRAM)
		this.taskQueue = []
		this.macrotaskID = -1
		this.actionHandlers = ACTION_TYPES.reduce((map, actionType) => {
			const inputActionHandlers = (actionHandlers as ActionHandlers)[actionType]
			if (inputActionHandlers === undefined) {
				map[actionType] = []
			} else {
				map[actionType] = [...inputActionHandlers]
			}
			return map
		}, {} as ActionHandlers)
		this.actionHandlers[ActionType.HALT_EXECUTION] = [this.handleHaltExecutionAction.bind(this)]
		this.actionHandlers[ActionType.END_STEP] = [this.handleEndStepAction.bind(this)]
		this.actionHandlers[ActionType.END_INSTRUCTION] = [
			this.handleEndInstructionAction.bind(this),
		]
		this.actionHandlers[ActionType.END_PROGRAM] = [this.handleEndProgramAction.bind(this)]
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

	/** Start/resume the execution with the specified stepping mode */
	play(steppingMode: SteppingMode): void {
		this._steppingMode = steppingMode
		this.start()
		if (this.taskQueue.length === 0) {
			this.taskQueue.push() // TODO: submit tasks
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
	}

	/** Log all the currently scheduled tasks to the console */
	debugTasks(): void {
		let taskIndex = 0
		for (const task of this.taskQueue) {
			if (task instanceof Action) {
				console.debug(`${taskIndex.toString().padStart(3)} - ${task.toString()}`)
			} else if (task instanceof ActionGroup) {
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
		if (nextTask instanceof ActionGroup) {
			await Promise.all(nextTask.actions.map(action => this.executeAction(action)))
			return
		}
		unreachable()
	}

	/** Execute the provided action */
	private async executeAction(action: Action): Promise<void> {
		const handlers = this.actionHandlers[action.type]
		try {
			for (const handler of handlers) {
				const actionWasHandled = await handler(action, this.submitTasksFunc)
				if (actionWasHandled) {
					return
				}
			}
		} catch (error: unknown) {
			unreachable(
				`An error was thrown by an action handler.\n\tAction: ${action.toString()}\n\tError: ${error}`,
			)
		}
		console.warn(`Unhandled action: ${action.toString()}`)
	}

	/** {@link ActionHandler} for {@link HaltExecutionAction} */
	private handleHaltExecutionAction(): boolean {
		this.reset()
		return true
	}

	/** {@link ActionHandler} for {@link EndExecutionStepAction} */
	private handleEndStepAction(): boolean {
		if (this._steppingMode === SteppingMode.STEP) {
			this.pause()
		}
		return true
	}

	/** {@link ActionHandler} for {@link EndInstructionAction} */
	private handleEndInstructionAction(): boolean {
		this.assertNoTasks()
		if (this._steppingMode !== SteppingMode.PROGRAM) {
			this.pause()
		}
		return true
	}

	/** {@link ActionHandler} for {@link EndProgramAction} */
	private handleEndProgramAction(): boolean {
		this.reset()
		return true
	}

	/** Assert that the task queue is empty */
	private assertNoTasks(): void {
		if (this.taskQueue.length !== 0) {
			this.debugTasks()
			unreachable("The task queue is not empty")
		}
	}
}
