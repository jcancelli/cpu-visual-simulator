import type { MemoryOperation } from "$lib/memory.svelte"
import type { Notification, NotificationType } from "$lib/notifications.svelte"

/** Identifier of the type of an {@link Action} */
export enum ActionType {
	// Execution
	HALT_EXECUTION,
	END_INSTRUCTION,
	END_STEP,
	// Bus
	SIGNAL_BUS,
	END_SIGNAL_BUS,
	READ_BUS,
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
	AWAIT_TEXT_TO_SPEECH_END,
	// UI animations
	FLASH_UI_ELEMENT,
	// Notifications
	NOTIFY_USER,
}

/** All {@link ActionType}s as list */
export const ACTION_TYPES = Object.values(ActionType).filter(
	v => typeof v !== "string",
) as ReadonlyArray<ActionType>

/** An action that can be performed by the {@link TaskSystem} */
export type Action =
	| HaltExecutionAction
	| EndInstructionAction
	| EndStepAction
	| SignalBusAction
	| EndSignalBusAction
	| ReadBusAction
	| DecodeInstructionAction
	| ExecuteInstructionAction
	| SetMemoryOperationAction
	| PerformMemoryOperationAction
	| UpdateStepDescriptionAction
	| TextToSpeechReadAction
	| AwaitTextoToSpeechEndAction
	| FlashUIElementAction
	| NotifyUserAction

/** Template for an {@link Action} type */
export type ActionBase<T extends ActionType, U = never> = Readonly<
	[U] extends [never] ? { type: T } : { type: T } & U
>

// Execution
/** Halt the execution */
export type HaltExecutionAction = ActionBase<ActionType.HALT_EXECUTION>
/** Signal the end of an instruction */
export type EndInstructionAction = ActionBase<ActionType.END_INSTRUCTION>
/** Signal the end of a step */
export type EndStepAction = ActionBase<ActionType.END_STEP>
/** Halt the execution */
export const haltExecution: HaltExecutionAction = { type: ActionType.HALT_EXECUTION }
/** Signal the end of an instruction */
export const endInstruction: EndInstructionAction = {
	type: ActionType.END_INSTRUCTION,
}
/** Signal the end of a step */
export const endStep: EndStepAction = { type: ActionType.END_STEP }

// Bus
/** Source or destination for a {@link Bus} read/write operation */
export enum BusIO {
	// CPU
	PROGRAM_COUNTER,
	PROGRAM_COUNTER_INCREMENT,
	INSTRUCTION_REGISTER,
	DECODER_CTRL_UNIT,
	MUX,
	ALU,
	ACCUMULATOR,
	STATUS_WORD,
	// Memory
	MEMORY,
}
/** IDs of all the busses */
export enum BusID {
	DATA,
	ADDRESS,
	CONTROL,
	OPCODE_DECODER,
	MUX_ALU,
	CONTROL_UNIT_MUX,
	CONTROL_UNIT_ALU,
	ALU_STATUS_WORD,
	ALU_ACCUMULATOR,
}
/** Put a signal on a {@link Bus} */
export type SignalBusAction = ActionBase<ActionType.SIGNAL_BUS, { source: BusIO; bus: BusID }>
/** End the signal on a {@link Bus} */
export type EndSignalBusAction = ActionBase<ActionType.END_SIGNAL_BUS, { bus: BusID }>
/** Read the signal from a {@link Bus} */
export type ReadBusAction = ActionBase<ActionType.READ_BUS, { source: BusIO; bus: BusID }>
/** Put a signal on a {@link Bus} */
export function signalBus(source: BusIO, bus: BusID): SignalBusAction {
	return {
		type: ActionType.SIGNAL_BUS,
		source,
		bus,
	}
}
/** End the signal on a {@link Bus} */
export function endSignalBus(bus: BusID): EndSignalBusAction {
	return {
		type: ActionType.END_SIGNAL_BUS,
		bus,
	}
}
/** Read the signal from a {@link Bus} */
export function readBus(source: BusIO, bus: BusID): ReadBusAction {
	return {
		type: ActionType.READ_BUS,
		source,
		bus,
	}
}

// Cpu
/** Decode the opcode signal found on the bus between instruction register and decoder */
export type DecodeInstructionAction = ActionBase<ActionType.DECODE_INSTRUCTION>
/** Execute whatever instruction the ALU was set to perform */
export type ExecuteInstructionAction = ActionBase<ActionType.EXECUTE_INSTRUCTION>
/** Set the operation that the control unit will signal on the control bus */
export type SetMemoryOperationAction = ActionBase<
	ActionType.SET_MEMORY_OPERATION,
	{ operation: MemoryOperation }
>
/** Decode the opcode signal found on the bus between instruction register and decoder */
export const decodeInstruction: DecodeInstructionAction = {
	type: ActionType.DECODE_INSTRUCTION,
}
/** Execute whatever instruction the ALU was set to perform */
export const executeInstruction: ExecuteInstructionAction = {
	type: ActionType.EXECUTE_INSTRUCTION,
}
/** Set the operation that the control unit will signal on the control bus */
export function setMemoryOperation(operation: MemoryOperation): SetMemoryOperationAction {
	return {
		type: ActionType.SET_MEMORY_OPERATION,
		operation,
	}
}

// Memory
/** Perform whatever operation was signaled to the memory */
export type PerformMemoryOperationAction = ActionBase<ActionType.PERFORM_MEMORY_OPERATION>
/** Perform whatever operation was signaled to the memory */
export const performMemoryOperation: PerformMemoryOperationAction = {
	type: ActionType.PERFORM_MEMORY_OPERATION,
}

// Step description
/** Set the text for the step description box */
export type UpdateStepDescriptionAction = ActionBase<
	ActionType.UPDATE_STEP_DESCRIPTION,
	{ text: string }
>
/** Set the text for the step description box */
export function updateStepDescription(text: string): UpdateStepDescriptionAction {
	return {
		type: ActionType.UPDATE_STEP_DESCRIPTION,
		text,
	}
}

// Text-to-speech
/** Read some text */
export type TextToSpeechReadAction = ActionBase<ActionType.TEXT_TO_SPEECH_READ, { text: string }>
/** Wait for text-to-speech to finish reading */
export type AwaitTextoToSpeechEndAction = ActionBase<ActionType.AWAIT_TEXT_TO_SPEECH_END>
/** Read some text */
export function textToSpeechRead(text: string): TextToSpeechReadAction {
	return {
		type: ActionType.TEXT_TO_SPEECH_READ,
		text,
	}
}
/** Wait for text-to-speech to finish reading */
export const awaitTextToSpeechEnd: AwaitTextoToSpeechEndAction = {
	type: ActionType.AWAIT_TEXT_TO_SPEECH_END,
}

// UI animations
/** Identifier of an UI element */
export enum UIElement {
	// CPU
	PROGRAM_COUNTER,
	PROGRAM_COUNTER_INCREMENT,
	INSTRUCTION_REGISTER,
	INSTRUCTION_REGISTER_OPERAND,
	INSTRUCTION_REGISTER_OPCODE,
	DECODER_CTRL_UNIT,
	MUX,
	ALU_OPERAND_1,
	ALU_OPERAND_2,
	ALU_OPERATION,
	ACCUMULATOR,
	STATUS_WORD,
	STATUS_WORD_ZERO_FLAG,
	STATUS_WORD_NEGATIVE_FLAG,
	// Memory
	MEMORY_ADDRESS,
	MEMORY_DATA,
	// Labels
	LABEL,
}
/** Flash an UI element */
export type FlashUIElementAction = ActionBase<ActionType.FLASH_UI_ELEMENT, { element: UIElement }>
/** Flash an UI element */
export function flashUIElement(element: UIElement): FlashUIElementAction {
	return {
		type: ActionType.FLASH_UI_ELEMENT,
		element,
	}
}

// Notifications
/** Display a notification */
export type NotifyUserAction = ActionBase<ActionType.NOTIFY_USER, { notification: Notification }>
/** Display a notification */
export function notifyUser(
	type: NotificationType,
	message: string,
	timerMs?: number,
	undismissable?: true,
): NotifyUserAction {
	return {
		type: ActionType.NOTIFY_USER,
		notification: {
			type,
			message,
			timerMs,
			undismissable,
		},
	}
}

/** Utility type that maps an {@link ActionType} to it's associated {@link Action} */
export type ActionTypeMapping = {
	// Execution
	[ActionType.HALT_EXECUTION]: HaltExecutionAction
	[ActionType.END_INSTRUCTION]: EndInstructionAction
	[ActionType.END_STEP]: EndStepAction
	// Bus
	[ActionType.SIGNAL_BUS]: SignalBusAction
	[ActionType.END_SIGNAL_BUS]: EndSignalBusAction
	[ActionType.READ_BUS]: ReadBusAction
	// Cpu
	[ActionType.DECODE_INSTRUCTION]: DecodeInstructionAction
	[ActionType.EXECUTE_INSTRUCTION]: ExecuteInstructionAction
	[ActionType.SET_MEMORY_OPERATION]: SetMemoryOperationAction
	// Memory
	[ActionType.PERFORM_MEMORY_OPERATION]: PerformMemoryOperationAction
	// Step description
	[ActionType.UPDATE_STEP_DESCRIPTION]: UpdateStepDescriptionAction
	// Text-to-speech
	[ActionType.TEXT_TO_SPEECH_READ]: TextToSpeechReadAction
	[ActionType.AWAIT_TEXT_TO_SPEECH_END]: AwaitTextoToSpeechEndAction
	// UI animations
	[ActionType.FLASH_UI_ELEMENT]: FlashUIElementAction
	// Notifications
	[ActionType.NOTIFY_USER]: NotifyUserAction
}
