import { MemoryOperation } from "$lib/state/memory.svelte"
import type { Notification, NotificationType } from "$lib/notifications.svelte"
import { Action, ActionType } from "./task"

/** Base class for all actions regarding execution */
export abstract class ExecutionAction extends Action {}

/** Halt the execution */
export class HaltExecutionAction extends ExecutionAction {
	constructor() {
		super(ActionType.HALT_EXECUTION)
	}
}

/** Signal the end of an instruction */
export class EndInstructionAction extends ExecutionAction {
	constructor() {
		super(ActionType.END_INSTRUCTION)
	}
}

/** Signal the end of a step */
export class EndStepAction extends ExecutionAction {
	constructor() {
		super(ActionType.END_STEP)
	}
}

/** Instance of {@link HaltExecutionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const haltExecution = new HaltExecutionAction()

/** Instance of {@link EndInstructionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endInstruction = new EndInstructionAction()

/** Instance of {@link EndStepAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endStep = new EndStepAction()

/** Source or destination for a read/write operation */
export enum Register {
	// CPU
	PROGRAM_COUNTER,
	INSTRUCTION_REGISTER,
	DECODER,
	CONTROL_UNIT,
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
	MEMORY_CONTROL,
	OPCODE_DECODER,
	MUX_ALU,
	MUX_CONTROL,
	ALU_CONTROL,
	STATUS_WORD,
	ALU_ACCUMULATOR,
}

/** Base class for an action regarding busses */
export abstract class BusAction extends Action {}

/** Put a signal on a {@link Bus} */
export class SendSignalBusAction extends BusAction {
	/** The bus carrying the signal */
	public readonly bus: BusID
	/** The source of the data */
	public readonly from: Register

	constructor(bus: BusID, from: Register) {
		super(ActionType.SEND_SIGNAL)
		this.bus = bus
		this.from = from
	}
}

/** End the signal on a {@link Bus} */
export class EndSignalBusAction extends BusAction {
	/** The bus carrying the signal */
	public readonly bus: BusID

	constructor(bus: BusID) {
		super(ActionType.END_SIGNAL)
		this.bus = bus
	}
}

/** Read the signal from a {@link Bus} */
export class ReadSignalBusAction extends BusAction {
	/** The bus carrying the signal */
	public readonly bus: BusID
	/** Where the signal will be wrote into */
	public readonly into: Register

	constructor(bus: BusID, into: Register) {
		super(ActionType.READ_SIGNAL)
		this.bus = bus
		this.into = into
	}
}

/** Put the value from a data source onto a {@link Bus} */
export function startSignalOnBus(bus: BusID, from: Register): SendSignalBusAction {
	return new SendSignalBusAction(bus, from)
}

/** End the signal on a {@link Bus} */
export function endSignalOnBus(bus: BusID): EndSignalBusAction {
	return new EndSignalBusAction(bus)
}

/** Write the signal found on a {@link Bus} into a destination */
export function readSignalFromBus(bus: BusID, into: Register): ReadSignalBusAction {
	return new ReadSignalBusAction(bus, into)
}

/** Base class for an action regarding the {@link CPU} */
export abstract class CPUAction extends Action {}

/** Decode the opcode read by the decoder */
export class DecodeInstructionAction extends CPUAction {
	constructor() {
		super(ActionType.DECODE_INSTRUCTION)
	}
}

/** Execute whatever instruction the ALU was set to perform */
export class ExecuteInstructionAction extends CPUAction {
	constructor() {
		super(ActionType.EXECUTE_INSTRUCTION)
	}
}

/** Instruct the control unit on what operation it sould signal to the memory next */
export class SetMemoryOperationAction extends CPUAction {
	/** The memory operation that should be signaled next */
	public readonly operation: MemoryOperation

	constructor(operation: MemoryOperation) {
		super(ActionType.SET_MEMORY_OPERATION)
		this.operation = operation
	}
}

/** Instance of {@link DecodeInstructionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const decodeInstruction = new DecodeInstructionAction()

/** Instance of {@link ExecuteInstructionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const executeInstruction = new ExecuteInstructionAction()

/** Instance of {@link SetMemoryOperationAction} for a {@link MemoryOperation.FETCH} operation.
 * Stored in a constant so that it can be reused without instancing new objects */
export const setMemoryFetchOperation = new SetMemoryOperationAction(MemoryOperation.FETCH)

/** Instance of {@link SetMemoryOperationAction} for a {@link MemoryOperation.READ} operation.
 * Stored in a constant so that it can be reused without instancing new objects */
export const setMemoryReadOperation = new SetMemoryOperationAction(MemoryOperation.READ)

/** Instance of {@link SetMemoryOperationAction} for a {@link MemoryOperation.WRITE} operation.
 * Stored in a constant so that it can be reused without instancing new objects */
export const setMemoryWriteOperation = new SetMemoryOperationAction(MemoryOperation.WRITE)

/** Base class for all actions regarding the {@link Memory} */
export abstract class MemoryAction extends Action {}

/** Perform whatever operation was signaled to the memory */
export class PerformMemoryOperationAction extends MemoryAction {
	constructor() {
		super(ActionType.PERFORM_MEMORY_OPERATION)
	}
}

/** Instance of {@link PerformMemoryOperationAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const performMemoryOperation = new PerformMemoryOperationAction()

/** Base class for actions regarding the step description */
export abstract class StepDescriptionAction extends Action {}

/** Set the text for the step description box */
export class UpdateStepDescriptionAction extends StepDescriptionAction {
	/** The key for the localized text */
	public readonly text: string

	// TODO: Maybe use an enum instead of a string?
	constructor(text: string) {
		super(ActionType.UPDATE_STEP_DESCRIPTION)
		this.text = text
	}
}

/** Set the text for the step description box */
export function updateStepDescription(text: string): UpdateStepDescriptionAction {
	return new UpdateStepDescriptionAction(text)
}

/** Base class for actions regarding text-to-speech */
export abstract class TextToSpeechAction extends Action {}

/** Read some text (no internationalization) */
export class TTSReadAction extends TextToSpeechAction {
	/** The text that will be read by text-to-speech */
	public readonly text: string

	constructor(text: string) {
		super(ActionType.TEXT_TO_SPEECH_READ)
		this.text = text
	}
}

/** Read some text from the localized strings */
export class TTSReadLocalizedAction<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<string, any> | undefined = undefined,
> extends TextToSpeechAction {
	/** The key for the localized text */
	public readonly text: string
	/** The parameters for the localized text */
	public readonly params: T

	// TODO: Maybe use an enum instead of string?
	constructor(text: string, params: T) {
		super(ActionType.TEXT_TO_SPEECH_LOCALIZED_READ)
		this.text = text
		this.params = params
	}
}

/** Wait for text-to-speech to finish reading */
export class WaitTextToSpeechEndAction extends TextToSpeechAction {
	constructor() {
		super(ActionType.WAIT_TEXT_TO_SPEECH_END)
	}
}

/** Read some text (no internationalization) */
export function ttsRead(text: string): TTSReadAction {
	return new TTSReadAction(text)
}

/** Read some text from the localized strings */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ttsLocalizedRead<T extends Record<string, any> | undefined>(
	text: string,
	params?: T,
): TTSReadAction {
	return new TTSReadLocalizedAction(text, params)
}

/** Instance of {@link WaitTextToSpeechEndAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const waitTextToSpeechEnd = new WaitTextToSpeechEndAction()

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

/** Base class for actions regarding UI elements */
export abstract class UIElementAction extends Action {}

/** Flash an UI element */
export class FlashUIElementAction extends UIElementAction {
	/** The UI element that will be flashed */
	public readonly element: UIElement

	constructor(element: UIElement) {
		super(ActionType.FLASH_UI_ELEMENT)
		this.element = element
	}
}

/** Flash an UI element */
export function flashUIElement(element: UIElement): FlashUIElementAction {
	return new FlashUIElementAction(element)
}

/** Base class for actions regarding user notifications */
export abstract class NotificationAction extends Action {}

/** Send a notification */
export class SendNotificationAction extends NotificationAction {
	public readonly notification: Notification

	constructor(notification: Notification) {
		super(ActionType.SEND_NOTIFICATION)
		this.notification = notification
	}
}

/** Send a notification */
export function sendNotification(
	type: NotificationType,
	message: string,
	timerMs?: number,
	undismissable?: true,
): SendNotificationAction {
	return new SendNotificationAction({
		type,
		message,
		timerMs,
		undismissable,
	})
}

/** Utility type that maps an {@link ActionType} to its associated {@link Action} subclass */
export type ActionOfType = {
	// Execution
	[ActionType.HALT_EXECUTION]: HaltExecutionAction
	[ActionType.END_INSTRUCTION]: EndInstructionAction
	[ActionType.END_STEP]: EndStepAction
	// Bus
	[ActionType.SEND_SIGNAL]: SendSignalBusAction
	[ActionType.END_SIGNAL]: EndSignalBusAction
	[ActionType.READ_SIGNAL]: ReadSignalBusAction
	// Cpu
	[ActionType.DECODE_INSTRUCTION]: DecodeInstructionAction
	[ActionType.EXECUTE_INSTRUCTION]: ExecuteInstructionAction
	[ActionType.SET_MEMORY_OPERATION]: SetMemoryOperationAction
	// Memory
	[ActionType.PERFORM_MEMORY_OPERATION]: PerformMemoryOperationAction
	// Step description
	[ActionType.UPDATE_STEP_DESCRIPTION]: UpdateStepDescriptionAction
	// Text-to-speech
	[ActionType.TEXT_TO_SPEECH_READ]: TTSReadAction
	[ActionType.TEXT_TO_SPEECH_LOCALIZED_READ]: TTSReadLocalizedAction
	[ActionType.WAIT_TEXT_TO_SPEECH_END]: WaitTextToSpeechEndAction
	// UI animations
	[ActionType.FLASH_UI_ELEMENT]: FlashUIElementAction
	// Notifications
	[ActionType.SEND_NOTIFICATION]: SendNotificationAction
}
