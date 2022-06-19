import Action from "../Action"
import { IS_ANIMATING } from "../Conditions"

export default abstract class Animation extends Action {
	constructor() {
		super()
		this.condition(IS_ANIMATING)
	}

	protected abstract action(): Promise<any>
}
