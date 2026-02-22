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

/** Identifier of the type of an {@link Action}.
 * Note: the code relies for this to be a numeric enum, don't change it into a string enum. */
export enum ActionType {
	// Execution
	HALT_EXECUTION,
	END_INSTRUCTION,
	END_STEP,
	// Bus
	SEND_SIGNAL,
	END_SIGNAL,
	READ_SIGNAL,
	// Cpu
	DECODE_INSTRUCTION,
	EXECUTE_INSTRUCTION,
	SET_MEMORY_OPERATION,
	// Memory
	PERFORM_MEMORY_OPERATION,
	// Step description
	UPDATE_STEP_DESCRIPTION,
	// Text-to-speech
	TEXT_TO_SPEECH_READ,
	TEXT_TO_SPEECH_LOCALIZED_READ,
	WAIT_TEXT_TO_SPEECH_END,
	// UI animations
	FLASH_UI_ELEMENT,
	// Notifications
	SEND_NOTIFICATION,
}

/** All {@link ActionType}s as list */
export const ACTION_TYPES = Object.values(ActionType).filter(
	enumValue => typeof enumValue !== "string",
) as ReadonlyArray<ActionType>
