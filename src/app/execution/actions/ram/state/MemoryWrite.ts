import { parseBinary, parseSymbolic } from "../../../../util/instructionParser"
import { main_address_bus, main_data_bus } from "../../../../store/busses"
import { ram as ramComponent } from "../../../../store/components"
import { ramStore } from "../../../../store/state"
import RamAction from "../RamAction"

export default class MemoryWrite extends RamAction {
	constructor() {
		super()
		this._name = "MemoryWrite"
	}

	protected async action(): Promise<any> {
		const ram = ramStore.get()
		const address = main_address_bus.get().unsigned()
		const prevSymbolicOpcode = ram.read(address).symbolicOpcode
		// if the destination address is showing the instruction as code but is not "NOP"
		if (/^[A-Z]+$/.test(prevSymbolicOpcode) && prevSymbolicOpcode !== "NOP") {
			ram.write(address, parseBinary(main_data_bus.get().toBinaryString())) // trick to write instruction as code
		} else {
			// if the destination address is showing the instruction as a number
			ram.write(address, parseSymbolic(main_data_bus.get().signed().toString())) // write instruction as number
		}
		await ramComponent.get().flashContent(address)
	}
}
