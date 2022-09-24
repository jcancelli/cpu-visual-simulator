import Action from "../Action"
import text, { Step } from "../../../store/text"
import { TTS_ENABLED } from "../Conditions"
import speechSynthesis from "../../../util/speechSynthesis"
import { language, ttsSpeed, ttsVoice } from "../../../store/settings"
import { ExecutionContext } from "../../ExecutionContext"

export default class ReadStep extends Action {
	readonly step: Step
	static utteranceEndedPromise: Promise<void>

	constructor(step: Step) {
		super()
		this._name = "ReadStep"
		this.step = step
		this.condition(TTS_ENABLED)
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		let resolve
		ReadStep.utteranceEndedPromise = new Promise<void>(res => (resolve = res))
		speechSynthesis.read(
			text.get().steps[this.step].tts,
			ttsSpeed.get(),
			speechSynthesis.getAvailableVoices(language.get()).find(voice => voice.name === ttsVoice.get()),
			() => resolve()
		)
	}

	toString(): string {
		return `${super.toString()}, step: ${this.step}`
	}
}
