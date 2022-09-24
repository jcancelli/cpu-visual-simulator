import Animation from "../../Animation"
import { ExecutionContext } from "../../../ExecutionContext"

export type FlashableCpuComponent =
	| "IR"
	| "IR:OPC"
	| "IR:OPR"
	| "PC"
	| "INC"
	| "MUX"
	| "CU"
	| "ALU:1"
	| "ALU:2"
	| "ALU:OPR"
	| "ACC"
	| "SW:Z"
	| "SW:N"

export default class FlashCpu extends Animation {
	protected component: FlashableCpuComponent

	constructor(component: FlashableCpuComponent) {
		super()
		this._name = "FlashCpu"
		this.component = component
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		return ctx.cpu.component.flash(this.component)
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
