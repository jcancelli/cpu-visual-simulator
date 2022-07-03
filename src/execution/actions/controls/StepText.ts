import { get } from "svelte/store"
import lang, { Step } from "../../../store/lang"
import Action from "../Action"
import { stepText } from "../../../store/components"

export default class StepText extends Action {
	readonly step: Step

	constructor(step: Step) {
		super()
		this.step = step
	}

	protected async action(): Promise<any> {
		get(stepText).setText(get(lang).steps[this.step].text)
	}

	toString(): string {
		return `${super.toString()}, step: ${this.step}`
	}
}
