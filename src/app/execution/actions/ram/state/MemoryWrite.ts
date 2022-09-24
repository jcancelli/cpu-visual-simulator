import RamAction from "../RamAction"
import { parseBinary, parseSymbolic } from "../../../../util/instructionParser"
import { ExecutionContext } from "../../../ExecutionContext"

export default class MemoryWrite extends RamAction {
	constructor() {
		super()
		this._name = "MemoryWrite"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		const address = ctx.wires.model.addr_main.get().unsigned()
		const prevSymbolicOpcode = ctx.ram.model.read(address).symbolicOpcode
		// if the destination address is showing the instruction as code but is not "NOP"
		if (/^[A-Z]+$/.test(prevSymbolicOpcode) && prevSymbolicOpcode !== "NOP") {
			ctx.ram.model.write(address, parseBinary(ctx.wires.model.data_main.get().toBinaryString())) // trick to write instruction as code
		} else {
			// if the destination address is showing the instruction as a number
			ctx.ram.model.write(address, parseSymbolic(ctx.wires.model.data_main.get().signed().toString())) // write instruction as number
		}
		await ctx.ram.component.flashContent(address)
	}
}
