import Action from "../Action"
import speechSynthesis from "../../../util/speechSynthesis"
import { TTS_ENABLED } from "../Conditions"
import { language, ttsSpeed, ttsVoice } from "../../../store/settings"
import { ExecutionContext } from "../../ExecutionContext"

export default class TextToSpeech extends Action {
	readonly text: string

	constructor(text: string) {
		super()
		this._name = "TextToSpeech"
		this.text = text
		this.condition(TTS_ENABLED)
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		speechSynthesis.read(
			this.text,
			ttsSpeed.get(),
			speechSynthesis.getAvailableVoices(language.get()).find(voice => voice.name === ttsVoice.get())
		)
	}

	toString(): string {
		return `${super.toString()}, text: ${this.text}`
	}
}
