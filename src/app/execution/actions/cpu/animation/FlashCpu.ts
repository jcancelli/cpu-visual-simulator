import { get } from "svelte/store"
import { cpu } from "../../../../store/components"
import Animation from "../../Animation"

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
		this.component = component
	}

	protected async action(): Promise<any> {
		return get(cpu).flash(this.component)
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
