import { todo, unreachable } from "$lib/util/development"
import { ACTION_TYPES, ActionType, type Action, type ActionTypeMapping } from "./action"

/** A task handled by the {@link TaskSystem} */
export type Task = Action | ActionGroup

/** Group some actions that should be executed concurrently */
export interface ActionGroup {
	actions: Action[]
}

/** Group the specified actions to be executed concurrently */
export function concurrently(...actions: Action[]): ActionGroup {
	return { actions }
}

/** Check if the specified task is an {@link Action} */
export function taskIsAction(task: Task): task is Action {
	return (task as Action).type !== undefined
}

/** Check if the specified task is an {@link ActionGroup} */
export function taskIsActionGroup(task: Task): task is ActionGroup {
	return (task as ActionGroup).actions !== undefined
}

/** A function that implements an action */
export type ActionHandler<T extends ActionType> = (
	action: ActionTypeMapping[T],
) => Promise<ActionHandlerResult>

/** Return value of an {@link ActionHandler} that did not perform the {@link Action} it has received */
export interface ActionUnhandled {
	/** Wether the {@link Action} passed to the {@link ActionHandler} was performed to completion
	 * or if the next handler for this {@link ActionType} should be invoked */
	actionWasHandled: false
}

/** Return value of an {@link ActionHandler} that performed the {@link Action} it has received */
export interface ActionHandled {
	/** Wether the {@link Action} passed to the {@link ActionHandler} was performed to completion
	 * or if the next handler for this {@link ActionType} should be invoked */
	actionWasHandled: true
	/** Tasks that the {@link ActionHandler} want to be enqueued for execution */
	newTasks?: Task[]
}

/** The return value of an {@link ActionHandler} */
export type ActionHandlerResult = ActionUnhandled | ActionHandled

/** An object that can provide an implementation for the execution of some {@link Action} */
export interface ActionPerformer {
	/** @returns The handlers for some {@link Action}s mapped to their {@link ActionType}s */
	getActionHandlersMappings(): ActionHandlerMapping[]
}

/** Maps an {@link ActionHandler} to an {@link ActionType} */
export type ActionHandlerMapping = {
	[Type in ActionType]: {
		action: Type
		handler: ActionHandler<Type>
	}
}[ActionType]

/** System that schedules and executes {@link Task}s */
export class TaskSystem {
	/** The {@link ActionHandler}s available mapped to their relative {@link ActionType} */
	private actionHandlers: {
		[T in ActionType]: ActionHandler<T>[]
	}
	/** The FIFO queue of tasks that should be executed */
	private taskQueue: Task[]

	constructor() {
		this.actionHandlers = ACTION_TYPES.reduce(
			(map, type) => {
				map[type] = []
				return map
			},
			{} as { [T in ActionType]: ActionHandler<T>[] },
		)
		this.taskQueue = []
	}

	/** Add the {@link ActionHandler} provided by the specified {@link ActionPerformer} to the
	 * handlers available to this {@link TaskSystem} */
	mapActionPerformer(performer: ActionPerformer): void {
		for (const mapping of performer.getActionHandlersMappings()) {
			const handlers = this.actionHandlers[mapping.action]
			handlers.push(mapping.handler)
		}
	}

	/** Submit tasks for execution */
	submitTasks(...tasks: Task[]): void {
		this.taskQueue.push(...tasks)
	}

	/** Cancel all tasks that are yet to be executed */
	cancelTasks(): void {
		this.taskQueue = []
	}

	/** All tasks scheduled for execution were executed */
	isDone(): boolean {
		return this.taskQueue.length === 0
	}

	/** Execute the next task scheduled for execution */
	async executeNextTask(): Promise<void> {
		if (this.isDone()) {
			return
		}
		const nextTask = this.taskQueue.shift()!
		const newTasksPromises: Promise<Task[]>[] = []
		if (taskIsAction(nextTask)) {
			const handlers = this.actionHandlers[nextTask.type] as ActionHandler<
				typeof nextTask.type
			>[]
			newTasksPromises.push(dispatchActionHandlersRecursive(nextTask, handlers))
		} else if (taskIsActionGroup(nextTask)) {
			for (const action of nextTask.actions) {
				const handlers = this.actionHandlers[action.type] as ActionHandler<
					typeof action.type
				>[]
				newTasksPromises.push(dispatchActionHandlersRecursive(action, handlers))
			}
		} else {
			unreachable()
		}
		const newTasks = await Promise.all(newTasksPromises).then(tasks => tasks.flat())
		this.taskQueue.push(...newTasks)
	}
}

/** Dispatch the {@link ActionHandler}s one by one, starting from the provided index (or 0),
 * until the {@link Action} is handled */
async function dispatchActionHandlersRecursive(
	action: Action,
	handlers: ActionHandler<(typeof action)["type"]>[],
	handlerIndex: number = 0,
): Promise<Task[]> {
	if (handlerIndex >= handlers.length) {
		unreachable(`Unhandled action: ${ActionType[action.type]}`)
	}
	let result: ActionHandlerResult
	try {
		result = await handlers[handlerIndex](action)
	} catch (error: unknown) {
		// TODO: handle errors thrown by the handlers
		todo(
			`An error was thrown by an action handler. ActionType: ${ActionType[action.type]}. Error: ${error}`,
		)
	}
	if (result.actionWasHandled) {
		return result.newTasks ?? []
	}
	return dispatchActionHandlersRecursive(action, handlers, handlerIndex + 1)
}
