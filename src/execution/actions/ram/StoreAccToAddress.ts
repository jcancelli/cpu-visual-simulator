import { get } from "svelte/store"
import { parse } from "../../../instruction/instructionParser"
import { ram } from "../../../store/components"
import ramStore from "../../../store/ramStore"
import BinaryValue from "../../../util/BinaryValue"
import state, { Key as StateKey } from "../../state"
import RamAction from "./RamAction"

export default class StoreAccToAddress extends RamAction {
	protected address: number | StateKey

	constructor(address: number | StateKey) {
		super()
		this.address = address
	}

	protected async action(): Promise<any> {
		const address =
			typeof this.address === "number" ? this.address : (state[this.address] as number)
		if (typeof address !== "number") {
			throw new Error("Address is not a number")
		}
		const prevSymbolicOpcode = ramStore.read(address).symbolicOpcode
		if (/^[A-Z]+$/.test(prevSymbolicOpcode) && prevSymbolicOpcode !== "NOP") {
			// if the destination address is showing the instruction as code but is not "NOP"
			ramStore.write(address, parse(new BinaryValue(16, state["ACC"]).toBinaryString(), true)) // write instruction as code
		} else {
			// if the destination address is showing the instruction as a number
			ramStore.write(address, parse(state["ACC"].toString(), false)) // write instruction as number
		}
		await get(ram).flashContent(address)
	}
}
