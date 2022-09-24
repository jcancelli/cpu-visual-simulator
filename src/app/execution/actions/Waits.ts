import { ExecutionContext } from "../ExecutionContext"
import ReadStep from "./tts/ReadStep"

/** A function that takes an execution context and returns a promise. Used by actions to await specific events */
export type Wait = (ctx: ExecutionContext) => Promise<any>

/**
 * Waits for the text to speech api to finish its utterance
 * @param ctx - The object that contains all of the components needed by an action to execute (ex. cpu, ram, etc.)
 * @returns
 */
export async function TTS_FINISHED(ctx: ExecutionContext): Promise<any> {
	return ReadStep.utteranceEndedPromise
}
