import CpuAction from "../CpuAction"
import BinaryValue from "../../../../model/BinaryValue"
import { ExecutionContext } from "../../../ExecutionContext"

export default class SetALU2 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU2"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.cpu.model.alu2.set(new BinaryValue(16, ctx.wires.model.data_mux_alu.get().signed()))
		await ctx.cpu.component.flash("ALU:2")
	}
}
