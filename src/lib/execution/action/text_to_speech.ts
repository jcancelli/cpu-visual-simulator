import { ActionType } from "$lib/types/action"
import type { ExecutionStep } from "$lib/types/execution"
import { Action } from "../task"

/** Base class for actions regarding text-to-speech */
export abstract class TextToSpeechAction extends Action {}

/** Read some text (no internationalization) */
export class TextToSpeechReadAction extends TextToSpeechAction {
	/** The text that will be read by text-to-speech */
	public readonly text: string

	constructor(text: string) {
		super()
		this.text = text
	}

	override get actionType(): ActionType {
		return ActionType.TEXT_TO_SPEECH_READ
	}
}

/** Read some text from the localized strings */
export class TextToSpeechReadLocalizedAction<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<string, any> | undefined = undefined,
> extends TextToSpeechAction {
	/** The key for the localized text */
	public readonly text: string
	/** The parameters for the localized text */
	public readonly params?: T

	// TODO: Maybe use an enum instead of string?
	constructor(text: string, params?: T) {
		super()
		this.text = text
		this.params = params
	}

	override get actionType(): ActionType {
		return ActionType.TEXT_TO_SPEECH_READ_LOCALIZED
	}
}

/** Read the description of an execution step */
export class TextToSpeechReadExecutionStepAction extends TextToSpeechAction {
	/** The execution step of which description should be read */
	public readonly step: ExecutionStep

	constructor(step: ExecutionStep) {
		super()
		this.step = step
	}

	override get actionType(): ActionType {
		return ActionType.TEXT_TO_SPEECH_READ_EXECUTION_STEP
	}
}

/** Wait for text-to-speech to finish reading */
export class WaitTextToSpeechFinishAction extends TextToSpeechAction {
	override get actionType(): ActionType {
		return ActionType.WAIT_TEXT_TO_SPEECH_FINISH
	}
}

/** Read some text (no internationalization) */
export function ttsRead(text: string): TextToSpeechReadAction {
	return new TextToSpeechReadAction(text)
}

/** Read some text from the localized strings */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ttsReadLocalized<T extends Record<string, any> | undefined>(
	text: string,
	params?: T,
): TextToSpeechReadAction {
	return new TextToSpeechReadLocalizedAction(text, params)
}

/** Read the description of an execution step */
export function ttsReadStep(step: ExecutionStep): TextToSpeechReadExecutionStepAction {
	return new TextToSpeechReadExecutionStepAction(step)
}

/** Instance of {@link WaitTextToSpeechFinishAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const waitTextToSpeechToFinish = new WaitTextToSpeechFinishAction()
