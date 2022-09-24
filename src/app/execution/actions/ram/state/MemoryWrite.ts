import { parseBinary, parseSymbolic } from "../../../../util/instructionParser"
import { ram as ramComponent } from "../../../../store/components"
import { ramStore, wiresStore } from "../../../../store/state"
import RamAction from "../RamAction"

export default class MemoryWrite extends RamAction {
	constructor() {
		super()
		this._name = "MemoryWrite"
	}

	protected async action(): Promise<any> {
		const ram = ramStore.get()
		const address = wiresStore.get().addr_main.get().unsigned()
		const prevSymbolicOpcode = ram.read(address).symbolicOpcode
		// if the destination address is showing the instruction as code but is not "NOP"
		if (/^[A-Z]+$/.test(prevSymbolicOpcode) && prevSymbolicOpcode !== "NOP") {
			ram.write(address, parseBinary(wiresStore.get().data_main.get().toBinaryString())) // trick to write instruction as code
		} else {
			// if the destination address is showing the instruction as a number
			ram.write(address, parseSymbolic(wiresStore.get().data_main.get().signed().toString())) // write instruction as number
		}
		await ramComponent.get().flashContent(address)
	}
}
