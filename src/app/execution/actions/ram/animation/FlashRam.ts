import Animation from "../../Animation"
import { ExecutionContext } from "../../../ExecutionContext"

export type FlashableRamComponent = "ADDRESS" | "DATA"

export default class FlashRam extends Animation {
	protected component: FlashableRamComponent

	constructor(component: FlashableRamComponent) {
		super()
		this._name = "FlashRam"
		this.component = component
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		switch (this.component) {
			case "ADDRESS":
				return ctx.ram.component.flashAddress(ctx.wires.model.addr_main.get().unsigned())
			case "DATA":
				return ctx.ram.component.flashContent(ctx.wires.model.addr_main.get().unsigned())
		}
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
