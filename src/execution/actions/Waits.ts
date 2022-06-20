import ReadStep from "./tts/ReadStep"

export type Wait = () => Promise<any>

export async function TTS_FINISHED(): Promise<any> {
	return ReadStep.utteranceEndedPromise
}
