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
	public readonly type: ActionType

	constructor(type: ActionType) {
		super()
		this.type = type
	}

	override toString(): string {
		return `ACTION ID-${this.id} ${ActionType[this.type]}`
	}
}

/** Grouping of actions that should be executed concurrently */
export class ActionGroup extends Task {
	public readonly actions: ReadonlyArray<Action>

	constructor(actions: Action[]) {
		super()
		this.actions = [...actions]
	}

	override toString(): string {
		return `ACTION_GROUP ID-${this.id} (${this.actions.length} actions)`
	}
}

/** Group actions that should be executed concurrently */
export function concurrently(...actions: Action[]): ActionGroup {
	return new ActionGroup(actions)
}
