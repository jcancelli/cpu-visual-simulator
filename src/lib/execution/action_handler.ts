import type { ActionType } from "$lib/types/action"
import type { Action, Task } from "./task"

/** Implementation of an {@link Action} behavior */
export interface ActionHandler<TAction extends Action> {
	/** The action type handled by this handler */
	get actionType(): ActionType
	/** Function that implements an {@link Action} execution.
	 * @param action The action that needs to be executed
	 * @param submitTasks A function that allows the handler to submit more tasks for execution */
	handle(action: TAction, submitTasks: SubmitTasksFunction): Promise<void> | void
}

/** Function passed to an {@link ActionHandler.handle} that allows it to submit more tasks for execution */
export type SubmitTasksFunction = (...tasks: Task[]) => void
