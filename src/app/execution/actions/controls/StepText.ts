import Action from "../Action"
import text, { Step } from "../../../store/text"
import { ExecutionContext } from "../../ExecutionContext"

export default class StepText extends Action {
	readonly step: Step

	constructor(step: Step) {
		super()
		this._name = "StepText"
		this.step = step
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.stepTextComponent.setText(text.get().steps[this.step].text)
	}

	toString(): string {
		return `${super.toString()}, step: ${this.step}`
	}
}
