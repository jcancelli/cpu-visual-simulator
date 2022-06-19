import { get } from "svelte/store"
import { parse } from "../../../instruction/instructionParser"
import { ram } from "../../../store/components"
import ramStore from "../../../store/ramStore"
import BinaryValue from "../../../util/BinaryValue"
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
		const prevSymbolicOpcode = ramStore.read(address).symbolicOpcode
		if (/^[A-Z]+$/.test(prevSymbolicOpcode) && prevSymbolicOpcode !== "NOP") {
			// if the destination address is showing the instruction as code but is not "NOP"
			ramStore.write(address, parse(new BinaryValue(16, cache["ACC"]).toBinaryString(), true)) // write instruction as code
		} else {
			// if the destination address is showing the instruction as a number
			ramStore.write(address, parse(cache["ACC"].toString(), false)) // write instruction as number
		}
		await get(ram).flashContent(address)
	}
}
