import type { Action, Task } from "./task"

/** Function that implements an {@link Action} execution.
 * @param action The action that needs to be executed
 * @param submitTasks A function that allows the handler to submit more tasks for execution
 * @returns Wether the action was handled or not */
export type ActionHandler<T extends Action> = (
	action: T,
	submitTasks: SubmitTasksFunction,
) => Promise<boolean> | boolean

/** Function passed to the {@link ActionHandler} that allows the handler to submit new tasks for execution */
export type SubmitTasksFunction = (...tasks: Task[]) => void
