import { get } from "svelte/store"
import text, { Step } from "../../../store/text"
import Action from "../Action"
import { stepText as stepTextComponent } from "../../../store/components"

export default class StepText extends Action {
	readonly step: Step

	constructor(step: Step) {
		super()
		this._name = "StepText"
		this.step = step
	}

	protected async action(): Promise<any> {
		stepTextComponent.get().setText(text.get().steps[this.step].text)
	}

	toString(): string {
		return `${super.toString()}, step: ${this.step}`
	}
}
