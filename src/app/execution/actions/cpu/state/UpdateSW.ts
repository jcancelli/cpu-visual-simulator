import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class UpdateSW extends CpuAction {
	constructor() {
		super()
		this._name = "UpdateSW"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		const acc = ctx.cpu.model.accumulator.get().signed()
		const zeroFlag = ctx.cpu.model.zeroFlag.get()
		const negativeFlag = ctx.cpu.model.negativeFlag.get()

		const z = acc === 0
		const n = acc < 0

		if (z !== zeroFlag && n !== negativeFlag) {
			ctx.cpu.model.zeroFlag.set(z)
			ctx.cpu.model.negativeFlag.set(n)
			await Promise.all([ctx.cpu.component.flash("SW:Z"), ctx.cpu.component.flash("SW:N")])
		} else {
			if (z !== zeroFlag) {
				ctx.cpu.model.zeroFlag.set(z)
				await ctx.cpu.component.flash("SW:Z")
			}
			if (n !== negativeFlag) {
				ctx.cpu.model.negativeFlag.set(n)
				await ctx.cpu.component.flash("SW:N")
			}
		}
	}
}
