import Action from "../Action"
import speechSynthesis from "../../../util/speechSynthesis"
import { TTS_ENABLED } from "../Conditions"
import { get } from "svelte/store"
import { language, ttsSpeed, ttsVoice } from "../../../store/settings"

export default class TextToSpeech extends Action {
	readonly text: string

	constructor(text: string) {
		super()
		this._name = "TextToSpeech"
		this.text = text
		this.condition(TTS_ENABLED)
	}

	protected async action(): Promise<any> {
		speechSynthesis.read(
			this.text,
			get(ttsSpeed),
			speechSynthesis.getAvailableVoices(get(language)).find(voice => voice.name === get(ttsVoice))
		)
	}

	toString(): string {
		return `${super.toString()}, text: ${this.text}`
	}
}
