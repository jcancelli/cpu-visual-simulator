import { ActionType } from "$lib/types/action"

/** Task that can be executed by the task system */
export abstract class Task {
	private static idCounter = 1

	public readonly id: number

	constructor() {
		this.id = Task.idCounter
		Task.idCounter += 1
	}

	abstract toString(): string
}

/** An action that can be performed by the task system */
export abstract class Action extends Task {
	abstract get actionType(): ActionType

	override toString(): string {
		return `ACTION ID-${this.id} ${ActionType[this.actionType]}`
	}
}

/** A group of actions that should be either all executed or none of them.
 * The order of execution is preserved. */
export class AtomicActionGroup extends Task {
	public readonly actions: ReadonlyArray<Action>

	constructor(actions: Action[]) {
		super()
		this.actions = [...actions]
	}

	override toString(): string {
		return `ACTION_GROUP ID-${this.id} (${this.actions.length} actions)`
	}
}

/** A group of actions that should be either all executed or none of them.
 * The order of execution is preserved. */
export function atomic(...actions: Action[]): AtomicActionGroup {
	return new AtomicActionGroup(actions)
}
