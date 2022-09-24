import CpuAction from "../CpuAction"
import { parseBinary } from "../../../../util/instructionParser"
import { ExecutionContext } from "../../../ExecutionContext"

export default class SetIR extends CpuAction {
	constructor() {
		super()
		this._name = "SetIR"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.cpu.model.instructionRegister.set(parseBinary(ctx.wires.model.data_main.get().toBinaryString()))
		await ctx.cpu.component.flash("IR")
	}
}
