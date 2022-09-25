import Action from "../Action"
import text, { Step } from "../../../store/text"
import { ExecutionContext } from "../../ExecutionContext"
import { STEP_TEXT_IS_SHOWING } from "../Conditions"

export default class StepText extends Action {
	readonly step: Step

	constructor(step: Step) {
		super()
		this._name = "StepText"
		this.step = step
		this.condition(STEP_TEXT_IS_SHOWING)
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.stepTextComponent.setText(text.get().steps[this.step].text)
	}

	toString(): string {
		return `${super.toString()}, step: ${this.step}`
	}
}
