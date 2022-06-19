import { Key as StateKey } from "../../state"
import Action from "../Action"

export default abstract class StateAction extends Action {
	protected key: StateKey

	constructor(key: StateKey) {
		super()
		this.key = key
	}

	toString(): string {
		return `${super.toString()}, key: ${this.key}`
	}
}
