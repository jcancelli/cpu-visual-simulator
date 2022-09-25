import Action from "./Action"
import { AND, NOT, ANIMATIONS_ENABLED, MINIMAL_ANIMATIONS } from "./Conditions"

export default abstract class Animation extends Action {
	constructor() {
		super()
		this._name = "Animation"
		this.condition(AND(NOT(MINIMAL_ANIMATIONS), ANIMATIONS_ENABLED))
	}
}
