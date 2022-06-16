import Action from "../Action"
import { Cache } from "../../execution"
import { get } from "svelte/store"
import { playAnimations } from "../../../store/settings"

export default abstract class Animation extends Action {
	protected async action(cache: Cache): Promise<any> {
		if (get(playAnimations)) {
			return this._animate(cache)
		}
	}

	protected abstract _animate(cache: Cache): Promise<any>
}
