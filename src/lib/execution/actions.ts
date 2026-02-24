import { ActionType } from "$lib/types/action"
import type { ActionHandler } from "./action_handler"
import type { EndSignalBusAction, ReadSignalBusAction, SendSignalBusAction } from "./actions/bus"
import type {
	DecodeOpcodeAction,
	ExecuteALUOperationAction,
	ExecuteOpcodeAction,
	IncrementProgramCounterAction,
	ResetProgramCounterAction,
	SetMemoryOperationAction,
} from "./actions/cpu"
import type {
	EndStepAction,
	EndInstructionAction,
	EndProgramAction,
	StartStepAction,
} from "./actions/execution"
import type {
	TextToSpeechReadAction,
	TextToSpeechReadExecutionStepAction,
	TextToSpeechReadLocalizedAction,
	WaitTextToSpeechFinishAction,
} from "./actions/text_to_speech"
import type {
	CancelUIElementAnimationAction,
	FlashUIElementAction,
	WaitUIElementAnimationAction,
} from "./actions/animation"
import type { Action } from "./task"

/** Utility type where {@link Action} subclasses are indexed by their {@link ActionType} */
export type ActionOfType = {
	// Execution
	[ActionType.START_STEP]: StartStepAction
	[ActionType.END_STEP]: EndStepAction
	[ActionType.END_INSTRUCTION]: EndInstructionAction
	[ActionType.END_PROGRAM]: EndProgramAction
	// Bus
	[ActionType.SEND_SIGNAL]: SendSignalBusAction
	[ActionType.END_SIGNAL]: EndSignalBusAction
	[ActionType.READ_SIGNAL]: ReadSignalBusAction
	// CPU
	[ActionType.DECODE_OPCODE]: DecodeOpcodeAction
	[ActionType.EXECUTE_OPCODE]: ExecuteOpcodeAction
	[ActionType.EXECUTE_ALU_OPERATION]: ExecuteALUOperationAction
	[ActionType.SET_MEMORY_OPERATION]: SetMemoryOperationAction
	[ActionType.INCREMENT_PROGRAM_COUNTER]: IncrementProgramCounterAction
	[ActionType.RESET_PROGRAM_COUNTER]: ResetProgramCounterAction
	// Text to speech
	[ActionType.TEXT_TO_SPEECH_READ]: TextToSpeechReadAction
	[ActionType.TEXT_TO_SPEECH_READ_LOCALIZED]: TextToSpeechReadLocalizedAction
	[ActionType.TEXT_TO_SPEECH_READ_EXECUTION_STEP]: TextToSpeechReadExecutionStepAction
	[ActionType.WAIT_TEXT_TO_SPEECH_FINISH]: WaitTextToSpeechFinishAction
	// Notifications
	[ActionType.SEND_NOTIFICATION]: Action // TODO:
	// Animations
	[ActionType.FLASH_UI_ELEMENT]: FlashUIElementAction
	[ActionType.WAIT_UI_ELEMENT_ANIMATION]: WaitUIElementAnimationAction
	[ActionType.CANCEL_UI_ELEMENT_ANIMATION]: CancelUIElementAnimationAction
	[ActionType.FLASH_WIRE]: Action //TODO:
	[ActionType.WAIT_WIRE_ANIMATION]: Action //TODO:
	[ActionType.CANCEL_WIRE_ANIMATION]: Action //TODO:
}

/** {@link ActionHandler} for a specific {@link ActionType} */
export type ActionHandlerFor<T extends ActionType> = ActionHandler<ActionOfType[T]>
