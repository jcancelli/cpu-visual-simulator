/** Type of an {@link Action} subclass.
 * Needed to allow switching on an {@link Action} type instead of using instanceof.
 * Note: the code relies for this to be a numeric enum, don't change it into a string enum. */
export enum ActionType {
	// Execution
	HALT_EXECUTION,
	START_STEP,
	END_STEP,
	END_INSTRUCTION,
	END_PROGRAM,
	// Bus
	SEND_SIGNAL,
	END_SIGNAL,
	READ_SIGNAL,
	// Cpu
	DECODE_OPCODE,
	EXECUTE_OPCODE,
	EXECUTE_ALU_OPERATION,
	SET_MEMORY_OPERATION,
	INCREMENT_PROGRAM_COUNTER,
	// Text-to-speech
	TEXT_TO_SPEECH_READ,
	TEXT_TO_SPEECH_READ_LOCALIZED,
	TEXT_TO_SPEECH_READ_EXECUTION_STEP,
	WAIT_TEXT_TO_SPEECH_FINISH,
	// Notifications
	SEND_NOTIFICATION,
	// Animations
	FLASH_UI_ELEMENT,
	WAIT_UI_ELEMENT_ANIMATION,
	CANCEL_UI_ELEMENT_ANIMATION,
	FLASH_WIRE,
	WAIT_WIRE_ANIMATION,
	CANCEL_WIRE_ANIMATION,
}

/** All {@link ActionType} enum values in a list */
export const ACTION_TYPES = Object.values(ActionType).filter(
	enumValue => typeof enumValue !== "string",
) as ReadonlyArray<ActionType>
