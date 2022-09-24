import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class SetACC extends CpuAction {
	constructor() {
		super()
		this._name = "SetACC"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.cpu.model.accumulator.set(ctx.wires.model.data_alu_acc.get())
		await ctx.cpu.component.flash("ACC")
	}
}
