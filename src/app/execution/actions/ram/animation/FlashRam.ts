import Animation from "../../Animation"
import { ram as ramComponent } from "../../../../store/components"
import { wiresStore } from "../../../../store/state"

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
				return ramComponent.get().flashAddress(wiresStore.get().addr_main.get().unsigned())
			case "DATA":
				return ramComponent.get().flashContent(wiresStore.get().addr_main.get().unsigned())
		}
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
