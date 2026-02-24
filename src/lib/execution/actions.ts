import { ActionType } from "$lib/types/action"
import type { ActionHandler } from "./action_handler"
import type { EndSignalBusAction, ReadSignalBusAction, SendSignalBusAction } from "./actions/bus"
import type {
	DecodeOpcodeAction,
	ExecuteALUOperationAction,
	ExecuteOpcodeAction,
	IncrementProgramCounterAction,
	SetMemoryOperationAction,
} from "./actions/cpu"
import type {
	EndStepAction,
	EndInstructionAction,
	EndProgramAction,
	HaltExecutionAction,
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
} from "./actions/ui"
import type { Action } from "./task"

/** Utility type where {@link Action} subclasses are indexed by their {@link ActionType} */
export type ActionOfType = {
	[ActionType.HALT_EXECUTION]: HaltExecutionAction
	[ActionType.END_STEP]: EndStepAction
	[ActionType.END_INSTRUCTION]: EndInstructionAction
	[ActionType.END_PROGRAM]: EndProgramAction
	[ActionType.END_STEP]: EndStepAction
	[ActionType.SEND_SIGNAL]: SendSignalBusAction
	[ActionType.END_SIGNAL]: EndSignalBusAction
	[ActionType.READ_SIGNAL]: ReadSignalBusAction
	[ActionType.DECODE_OPCODE]: DecodeOpcodeAction
	[ActionType.EXECUTE_OPCODE]: ExecuteOpcodeAction
	[ActionType.EXECUTE_ALU_OPERATION]: ExecuteALUOperationAction
	[ActionType.SET_MEMORY_OPERATION]: SetMemoryOperationAction
	[ActionType.INCREMENT_PROGRAM_COUNTER]: IncrementProgramCounterAction
	[ActionType.TEXT_TO_SPEECH_READ]: TextToSpeechReadAction
	[ActionType.TEXT_TO_SPEECH_READ_LOCALIZED]: TextToSpeechReadLocalizedAction
	[ActionType.TEXT_TO_SPEECH_READ_EXECUTION_STEP]: TextToSpeechReadExecutionStepAction
	[ActionType.WAIT_TEXT_TO_SPEECH_FINISH]: WaitTextToSpeechFinishAction
	[ActionType.SEND_NOTIFICATION]: Action // TODO:
	[ActionType.FLASH_UI_ELEMENT]: FlashUIElementAction
	[ActionType.WAIT_UI_ELEMENT_ANIMATION]: WaitUIElementAnimationAction
	[ActionType.CANCEL_UI_ELEMENT_ANIMATION]: CancelUIElementAnimationAction
	[ActionType.FLASH_WIRE]: Action //TODO:
	[ActionType.WAIT_WIRE_ANIMATION]: Action //TODO:
	[ActionType.CANCEL_WIRE_ANIMATION]: Action //TODO:
}

/** {@link ActionHandler} for a specific {@link ActionType} */
export type ActionHandlerFor<T extends ActionType> = ActionHandler<ActionOfType[T]>
