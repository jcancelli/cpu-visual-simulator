import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class UpdateSWCompare extends CpuAction {
	constructor() {
		super()
		this._name = "UpdateSWCompare"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		const alu1 = ctx.cpu.model.alu1.get().signed()
		const alu2 = ctx.cpu.model.alu2.get().signed()
		const zeroFlag = ctx.cpu.model.zeroFlag.get()
		const negativeFlag = ctx.cpu.model.negativeFlag.get()

		const z = alu2 === alu1
		const n = alu2 > alu1

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
