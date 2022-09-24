import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class SetALU1 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU1"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.cpu.model.alu1.set(ctx.wires.model.data_main.get())
		await ctx.cpu.component.flash("ALU:1")
	}
}
