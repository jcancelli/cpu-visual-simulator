import { parse } from "../../../instruction/instructionParser"
import ramStore from "../../../store/ramStore"
import { Cache, CacheableKey } from "../../execution"
import RamAction from "./RamAction"

export default class StoreAccToAddress extends RamAction {
	protected address: number | CacheableKey

	constructor(address: number | CacheableKey) {
		super()
		this.address = address
	}

	protected async action(cache: Cache): Promise<any> {
		const address =
			typeof this.address === "number" ? this.address : (cache[this.address] as number)
		if (typeof address !== "number") {
			throw new Error("Address is not a number")
		}
		ramStore.write(address, parse(cache["ACC"].toString(), false))
	}
}
