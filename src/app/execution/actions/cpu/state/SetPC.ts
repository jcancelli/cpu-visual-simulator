import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class SetPC extends CpuAction {
	constructor() {
		super()
		this._name = "SetPC"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.cpu.model.isJumping.set(true)
		ctx.cpu.model.programCounter.set(ctx.wires.model.addr_main.get())
		await ctx.cpu.component.flash("PC")
	}
}
