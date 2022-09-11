import Animation from "../../Animation"
import { ram as ramComponent } from "../../../../store/components"
import { main_address_bus } from "../../../../store/busses"

export type FlashableRamComponent = "ADDRESS" | "DATA"

export default class FlashRam extends Animation {
	protected component: FlashableRamComponent

	constructor(component: FlashableRamComponent) {
		super()
		this._name = "FlashRam"
		this.component = component
	}

	protected async action(): Promise<any> {
		switch (this.component) {
			case "ADDRESS":
				return ramComponent.get().flashAddress(main_address_bus.get().unsigned())
			case "DATA":
				return ramComponent.get().flashContent(main_address_bus.get().unsigned())
		}
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
