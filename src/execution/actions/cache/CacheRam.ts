import ramStore from "../../../store/ramStore"
import { Cache, CacheableKey } from "../../execution"
import CacheAction from "./CacheAction"

export default class CacheRam extends CacheAction {
	protected address: number | CacheableKey

	constructor(address: number | CacheableKey) {
		super("RAM")
		this.address = address
	}

	protected async action(cache: Cache): Promise<any> {
		const address =
			typeof this.address === "number" ? this.address : (cache[this.address] as number)
		if (typeof address !== "number") {
			throw new Error("Address is not a number")
		}
		cache["RAM"] = {
			address,
			data: ramStore.read(address)
		}
	}
}
