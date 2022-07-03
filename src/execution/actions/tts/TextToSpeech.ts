import Action from "../Action"
import SpeechSynthesis from "../../../util/SpeechSynthesis"
import { TTS_ENABLED } from "../Conditions"

export default class TextToSpeech extends Action {
	readonly text: string

	constructor(text: string) {
		super()
		this.text = text
		this.condition(TTS_ENABLED)
	}

	protected async action(): Promise<any> {
		SpeechSynthesis.read(this.text)
	}

	toString(): string {
		return `${super.toString()}, text: ${this.text}`
	}
}
