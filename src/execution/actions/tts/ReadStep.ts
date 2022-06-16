import { get } from "svelte/store"
import texts, { Step } from "../../../resources/text"
import { language } from "../../../store/settings"
import Action from "../Action"
import { TTS_ENABLED } from "../Conditions"
import { Cache } from "../../execution"
import SpeechSynthesis from "../../../util/SpeechSynthesis"

export default class ReadStep extends Action {
	readonly step: Step

	constructor(step: Step) {
		super()
		this.step = step
		this.condition(TTS_ENABLED)
	}

	protected async action(cache: Cache): Promise<any> {
		SpeechSynthesis.read(texts[get(language)].steps[this.step])
	}
}
