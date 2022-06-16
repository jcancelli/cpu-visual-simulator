import Action from "../Action"
import { Cache } from "../../execution"
import { IS_ANIMATING } from "../Conditions"

export default abstract class Animation extends Action {
	constructor() {
		super()
		this.condition(IS_ANIMATING)
	}

	protected abstract action(cache: Cache): Promise<any>
}
