import type { ActionType } from "$lib/types/action"
import type { Action, Task } from "./task"

/** Implementation of an {@link Action} behavior */
export interface ActionHandler<TAction extends Action> {
	/** The action type handled by this handler */
	get actionType(): ActionType
	/** Function that implements an {@link Action} execution.
	 * @param action The action that needs to be executed
	 * @param taskSystem A proxy object for the task system that allows this action handler to submit more tasks for execution */
	handle(action: TAction, taskSystem: TaskSystemProxy): Promise<void> | void
}

/** Proxy object passed to {@link ActionHandler.handle} that allows an action handler to submit more tasks for execution */
export interface TaskSystemProxy {
	/** Append new tasks at the end of the task queue */
	submit(...tasks: Task[]): void
	/** Prepend new tasks at the start of the task queue */
	submitWithPriority(...tasks: Task[]): void
}
