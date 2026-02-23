import { todo, unreachable } from "$lib/util/development"
import {
	isScheduleTasksLaterRequest,
	isScheduleTasksNowRequest,
	type ActionHandler,
	type ActionHandlerResult,
	type ActionConsumer,
	type ScheduleTasksRequest,
} from "./action_performer"
import { Action, ACTION_TYPES, ActionGroup, type ActionType, type Task } from "./task"

/** System that schedules and executes {@link Task|tasks} without blocking other code from executing */
export class TaskSystem {
	/** The {@link ActionHandler|action handlers} available to this task system indexed by the {@link ActionType|action type} they handle */
	private actionHandlers: Record<ActionType, ActionHandler<Action>[]>
	/** The FIFO queue of tasks that are scheduled for execution */
	private taskQueue: Task[]
	/** The ID returned by setTimeout */
	private timeoutID: number
	/** Wether this task system is active or not */
	private _isActive: boolean
	/** Wether this task system is idle or not.
	 * - `true` if this task system is active and the task queue is empty
	 * - `false` if this task system is inactive or the task queue is not empty */
	private _isIdle: boolean

	constructor() {
		this.actionHandlers = ACTION_TYPES.reduce(
			(map, type) => {
				map[type] = []
				return map
			},
			{} as Record<ActionType, ActionHandler<Action>[]>,
		)
		this.taskQueue = []
		this.timeoutID = -1
		this._isActive = $state(false)
		this._isIdle = $state(false)
	}

	/** Wether this task system is active or not */
	get isActive(): boolean {
		return this._isActive
	}

	/** Wether this task system is idle or not.
	 * - `true` if this task system is active and the task queue is empty
	 * - `false` if this task system is inactive or the task queue is not empty */
	get isIdle(): boolean {
		return this._isIdle
	}

	/** Activate this task system */
	activate(): void {
		if (this._isActive) {
			return
		}
		this._isActive = true
		this._isIdle = this.taskQueue.length === 0
		if (!this._isIdle) {
			this.submitJavascriptMacrotask()
		}
	}

	/** Deactivate this task system */
	deactivate(): void {
		if (!this._isActive) {
			return
		}
		this._isActive = false
		if (!this._isIdle) {
			this.clearJavascriptMacrotask()
		}
		this._isIdle = false
	}

	/** Add all the {@link ActionHandler|action handlers} exposed by the consumer to the ones dispatched by this task system */
	mapActionPerformer<TActionTypes extends ActionType>(
		consumer: ActionConsumer<TActionTypes>,
	): void {
		for (const [actionType, handler] of consumer.actionHandlers.entries()) {
			const handlers = this.actionHandlers[actionType]
			handlers.push(handler)
		}
	}

	/** Add tasks at the start of the task queue */
	submitTasksBefore(...tasks: Task[]): void {
		this.taskQueue.unshift(...tasks)
		if (this._isIdle && tasks.length > 0) {
			this._isIdle = false
			this.submitJavascriptMacrotask()
		}
	}

	/** Add tasks to the end of the task queue */
	submitTasksAfter(...tasks: Task[]): void {
		this.taskQueue.push(...tasks)
		if (this._isIdle && tasks.length > 0) {
			this._isIdle = false
			this.submitJavascriptMacrotask()
		}
	}

	/** Cancel all tasks scheduled for execution */
	cancelAllTasks(): void {
		this.clearJavascriptMacrotask()
		this.taskQueue = []
		if (this._isActive) {
			this._isIdle = true
		}
	}

	/** Submit {@link TaskSystem.step} to the javascript engine macrotask queue */
	private submitJavascriptMacrotask(): void {
		this.timeoutID = setTimeout(this.step, 0, this)
	}

	/** Clear {@link TaskSystem.step} macrotask from the javascript engine macrotask queue */
	private clearJavascriptMacrotask(): void {
		clearTimeout(this.timeoutID)
		this.timeoutID = -1
	}

	/** If active and not idle, execute one step and add the execution of the next step to the javascript engine macrotask queue,
	 * effectively implementing a loop that does not block other code from executing */
	private async step(): Promise<void> {
		if (!this._isActive || this._isIdle) {
			return
		}
		await this.executeNextTask()
		if (!this._isActive) {
			return
		}
		if (this.taskQueue.length === 0) {
			this._isIdle = true
			return
		}
		this.submitJavascriptMacrotask()
	}

	/** Execute the next task scheduled for execution */
	private async executeNextTask(): Promise<void> {
		const nextTask = this.taskQueue.shift()!
		const newTasksRequestsPromises: Promise<ScheduleTasksRequest | null>[] = []
		if (nextTask instanceof Action) {
			const handlers = this.actionHandlers[nextTask.type]
			newTasksRequestsPromises.push(dispatchActionHandlersRecursive(nextTask, handlers))
		} else if (nextTask instanceof ActionGroup) {
			for (const action of nextTask.actions) {
				const handlers = this.actionHandlers[action.type]
				newTasksRequestsPromises.push(dispatchActionHandlersRecursive(action, handlers))
			}
		} else {
			unreachable()
		}
		const newTasksRequests = await Promise.all(newTasksRequestsPromises)
		this.taskQueue.unshift(
			...newTasksRequests
				.filter(isScheduleTasksNowRequest)
				.flatMap(request => request.scheduleNow),
		)
		this.taskQueue.push(
			...newTasksRequests
				.filter(isScheduleTasksLaterRequest)
				.flatMap(request => request.scheduleLater),
		)
	}

	/** Log to console the tasks that are currently scheduled for execution */
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
}

/** Dispatch the {@link ActionHandler|action handlers} one by one, starting from the provided index (or 0),
 * until the {@link Action} is handled */
async function dispatchActionHandlersRecursive(
	action: Action,
	handlers: ActionHandler<Action>[],
	handlerIndex: number = 0,
): Promise<ScheduleTasksRequest | null> {
	if (handlerIndex >= handlers.length) {
		console.warn(`Unhandled action: ${action.toString()}`)
		return null
	}
	let result: ActionHandlerResult
	try {
		result = await handlers[handlerIndex](action)
	} catch (error: unknown) {
		// TODO: handle errors thrown by the handlers
		todo(
			`An error was thrown by an action handler. Action ${action.toString()}. Error: ${error}`,
		)
	}
	if (result.actionWasHandled) {
		return result.newTasks ?? null
	}
	return dispatchActionHandlersRecursive(action, handlers, handlerIndex + 1)
}
