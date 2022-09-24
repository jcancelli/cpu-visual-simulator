import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class SetALUOperation extends CpuAction {
	constructor() {
		super()
		this._name = "SetALUOperation"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		const operation = ctx.cpu.model.instructionRegister.get().opcode.operator
		ctx.cpu.model.aluOperation.set(operation)
		await ctx.cpu.component.flash("ALU:OPR")
	}
}
