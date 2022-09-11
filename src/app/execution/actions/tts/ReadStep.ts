import { get } from "svelte/store"
import text, { Step } from "../../../store/text"
import Action from "../Action"
import { TTS_ENABLED } from "../Conditions"
import speechSynthesis from "../../../util/speechSynthesis"
import { language, ttsSpeed, ttsVoice } from "../../../store/settings"

export default class ReadStep extends Action {
	readonly step: Step
	static utteranceEndedPromise: Promise<void>

	constructor(step: Step) {
		super()
		this._name = "ReadStep"
		this.step = step
		this.condition(TTS_ENABLED)
	}

	protected async action(): Promise<any> {
		let resolve
		ReadStep.utteranceEndedPromise = new Promise<void>(res => (resolve = res))
		speechSynthesis.read(
			text.get().steps[this.step].tts,
			get(ttsSpeed),
			speechSynthesis.getAvailableVoices(get(language)).find(voice => voice.name === get(ttsVoice)),
			() => resolve()
		)
	}

	toString(): string {
		return `${super.toString()}, step: ${this.step}`
	}
}
