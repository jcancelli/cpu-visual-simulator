import { get } from "svelte/store"
import { parseBinary, parseSymbolic } from "../../../../instruction/instructionParser"
import { main_address_bus, main_data_bus } from "../../../../store/busses"
import { ram as ramComponent } from "../../../../store/components"
import ram from "../../../../store/ram"
import RamAction from "../RamAction"

export default class MemoryWrite extends RamAction {
	constructor() {
		super()
		this._name = "MemoryWrite"
	}

	protected async action(): Promise<any> {
		const address = get(main_address_bus).unsigned()
		const prevSymbolicOpcode = get(ram).read(address).symbolicOpcode
		// if the destination address is showing the instruction as code but is not "NOP"
		if (/^[A-Z]+$/.test(prevSymbolicOpcode) && prevSymbolicOpcode !== "NOP") {
			get(ram).write(address, parseBinary(get(main_data_bus).toBinaryString())) // trick to write instruction as code
		} else {
			// if the destination address is showing the instruction as a number
			get(ram).write(address, parseSymbolic(get(main_data_bus).signed().toString())) // write instruction as number
		}
		await get(ramComponent).flashContent(address)
	}
}
