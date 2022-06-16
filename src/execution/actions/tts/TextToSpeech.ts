import Action from "../Action"
import { Cache } from "../../execution"
import SpeechSynthesis from "../../../util/SpeechSynthesis"
import { TTS_ENABLED } from "../Conditions"

export default class TextToSpeech extends Action {
	readonly text: string

	constructor(text: string) {
		super()
		this.text = text
		this.condition(TTS_ENABLED)
	}

	protected async action(cache: Cache): Promise<any> {
		SpeechSynthesis.read(this.text)
	}
}
