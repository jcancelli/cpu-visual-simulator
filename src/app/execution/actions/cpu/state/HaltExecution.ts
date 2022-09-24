import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class HaltExecution extends CpuAction {
	constructor() {
		super()
		this._name = "HaltExecution"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.cpu.model.isHalting.set(true)
	}
}
