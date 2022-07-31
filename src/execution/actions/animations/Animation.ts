import Action from "../Action"
import { MINIMAL_ANIMATIONS, NOT } from "../Conditions"

export default abstract class Animation extends Action {
	constructor() {
		super()
		this.condition(NOT(MINIMAL_ANIMATIONS))
	}

	protected abstract action(): Promise<any>
}
