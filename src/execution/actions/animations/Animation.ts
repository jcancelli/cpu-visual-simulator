import Action from "../Action"
import { Cache } from "../../execution"
import { get } from "svelte/store"
import animationStore from "../../../store/animationStore"

export default abstract class Animation extends Action {
	protected async action(cache: Cache): Promise<any> {
		if (get(animationStore).animate) {
			return this._animate(cache)
		}
	}

	protected abstract _animate(cache: Cache): Promise<any>
}
