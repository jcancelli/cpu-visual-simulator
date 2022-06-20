import { get } from "svelte/store"
import texts, { Step } from "../../../store/text"
import Action from "../Action"
import { TTS_ENABLED } from "../Conditions"
import SpeechSynthesis from "../../../util/SpeechSynthesis"

export default class ReadStep extends Action {
	readonly step: Step
	static utteranceEndedPromise: Promise<void>

	constructor(step: Step) {
		super()
		this.step = step
		this.condition(TTS_ENABLED)
	}

	protected async action(): Promise<any> {
		let resolve
		ReadStep.utteranceEndedPromise = new Promise<void>(res => (resolve = res))
		SpeechSynthesis.read(get(texts).steps[this.step], () => resolve())
	}
}
