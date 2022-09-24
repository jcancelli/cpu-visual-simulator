import Action from "./Action"
import { MINIMAL_ANIMATIONS, NOT } from "./Conditions"

export default abstract class Animation extends Action {
	constructor() {
		super()
		this._name = "Animation"
		this.condition(NOT(MINIMAL_ANIMATIONS))
	}
}
