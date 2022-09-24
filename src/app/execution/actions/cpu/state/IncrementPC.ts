import CpuAction from "../CpuAction"
import BinaryValue from "../../../../model/BinaryValue"
import { ExecutionContext } from "../../../ExecutionContext"

export default class IncrementPC extends CpuAction {
	constructor() {
		super()
		this._name = "IncrementPC"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		const newValue =
			ctx.cpu.model.programCounter.get().unsigned() + ctx.wires.model.addr_inc_pc.get().unsigned()
		ctx.cpu.model.programCounter.set(new BinaryValue(8, newValue))
		await ctx.cpu.component.flash("PC")
	}
}
