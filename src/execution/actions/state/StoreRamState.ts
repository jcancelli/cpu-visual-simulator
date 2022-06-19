import ramStore from "../../../store/ramStore"
import state, { Key as StateKey } from "../../state"
import StateAction from "./StateAction"

export default class CacheRam extends StateAction {
	protected address: number | StateKey

	constructor(address: number | StateKey) {
		super("RAM")
		this.address = address
	}

	protected async action(): Promise<any> {
		const address =
			typeof this.address === "number" ? this.address : (state[this.address] as number)
		if (typeof address !== "number") {
			throw new Error("Address is not a number")
		}
		state["RAM"] = {
			address,
			data: ramStore.read(address)
		}
	}
}
