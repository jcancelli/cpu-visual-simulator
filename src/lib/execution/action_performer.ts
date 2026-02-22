import type { ActionOfType } from "./action"
import type { Action, ActionType, Task } from "./task"

/** Provides functions to execute {@link Action}s */
export interface ActionConsumer<TActionTypes extends ActionType> {
	readonly actionHandlers: ActionHandlerMap<TActionTypes>
}

/** Map {@link ActionHandler}s to the {@link ActionType} they handle */
export class ActionHandlerMap<TActionTypes extends ActionType> implements ReadonlyMap<
	ActionType,
	ActionHandler<Action>
> {
	private map: Map<ActionType, ActionHandler<Action>> = new Map()

	constructor(mappings: {
		[K in TActionTypes]: ActionHandlerForType<K>
	}) {
		for (const actionType in mappings) {
			this.map.set(actionType, mappings[actionType] as ActionHandler<Action>)
		}
	}

	forEach(
		callbackfn: (
			value: ActionHandler<Action>,
			key: ActionType,
			map: ReadonlyMap<ActionType, ActionHandler<Action>>,
		) => void,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		thisArg?: any,
	): void {
		this.map.forEach(callbackfn, thisArg)
	}

	get(key: ActionType): ActionHandler<Action> | undefined {
		return this.map.get(key)
	}

	has(key: ActionType): boolean {
		return this.map.has(key)
	}

	entries(): MapIterator<[ActionType, ActionHandler<Action>]> {
		return this.map.entries()
	}

	keys(): MapIterator<ActionType> {
		return this.map.keys()
	}

	values(): MapIterator<ActionHandler<Action>> {
		return this.map.values()
	}

	[Symbol.iterator](): MapIterator<[ActionType, ActionHandler<Action>]> {
		return this.map[Symbol.iterator]()
	}

	get size(): number {
		return this.map.size
	}
}

/** A function that implements an action */
export type ActionHandler<T extends Action> = (action: T) => Promise<ActionHandlerResult>

/** Utility type that return the correct {@link ActionHandler} type for an {@link ActionType} */
export type ActionHandlerForType<T extends ActionType> = ActionHandler<ActionOfType[T]>

/** The return value of an {@link ActionHandler} */
export type ActionHandlerResult = ActionUnhandled | ActionHandled

/** Return value of an {@link ActionHandler} that did not perform the {@link Action} it has received */
export interface ActionUnhandled {
	/** Wether the {@link Action} passed to the {@link ActionHandler} was performed to completion
	 * or if the next handler for this {@link ActionType} should be invoked */
	actionWasHandled: false
}

/** Instance of {@link ActionUnhandled}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const ACTION_UNHANDLED: ActionUnhandled = { actionWasHandled: false }

/** Instance of {@link ActionHandled} without any new tasks.
 * Stored in a constant so that it can be reused without instancing new objects */
export const ACTION_HANDLED: ActionHandled = { actionWasHandled: true }

/** Return value of an {@link ActionHandler} that performed the {@link Action} it has received */
export interface ActionHandled {
	/** Wether the {@link Action} passed to the {@link ActionHandler} was performed to completion
	 * or if the next handler for this {@link ActionType} should be invoked */
	actionWasHandled: true
	/** Any task that the {@link ActionHandler} needs to execute */
	newTasks?: ScheduleTasksRequest
}

/** Tasks that should be scheduled by the task system */
export type ScheduleTasksRequest =
	| ScheduleTasksNowRequest
	| ScheduleTasksLaterRequest
	| (ScheduleTasksNowRequest & ScheduleTasksLaterRequest)

/** Tasks that should be scheduled by the {@link TaskSystem} before the currently scheduled tasks */
export interface ScheduleTasksNowRequest {
	/** These tasks will be inserted in front of the task queue */
	scheduleNow: Task[]
}

/** Tasks that should be scheduled by the {@link TaskSystem} after the currently scheduled tasks */
export interface ScheduleTasksLaterRequest {
	/** These tasks will be enqueued at the end of the task queue */
	scheduleLater: Task[]
}

/** Check that the provided value is a {@link ScheduleTasksNowRequest} */
export function isScheduleTasksNowRequest(value: unknown): value is ScheduleTasksNowRequest {
	return (value as ScheduleTasksNowRequest)?.scheduleNow !== undefined
}

/** Check that the provided value is a {@link ScheduleTasksLaterRequest} */
export function isScheduleTasksLaterRequest(value: unknown): value is ScheduleTasksLaterRequest {
	return (value as ScheduleTasksLaterRequest)?.scheduleLater !== undefined
}
