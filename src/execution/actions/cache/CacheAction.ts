import { CacheableKey } from "../../execution"
import Action from "../Action"

export default abstract class CacheAction extends Action {
	protected key: CacheableKey

	constructor(key: CacheableKey) {
		super()
		this.key = key
	}

	toString(): string {
		return `${super.toString()}, key: ${this.key}`
	}
}
