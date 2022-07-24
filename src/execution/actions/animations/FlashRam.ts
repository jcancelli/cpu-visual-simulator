import Animation from "./Animation"
import { get } from "svelte/store"
import { ram as ramComponent } from "../../../store/components"
import { main_address_bus } from "../../../store/busses"

export type FlashableRamComponent = "ADDRESS" | "DATA"

export default class FlashRam extends Animation {
	protected component: FlashableRamComponent

	constructor(component: FlashableRamComponent) {
		super()
		this.component = component
	}

	protected async action(): Promise<any> {
		switch (this.component) {
			case "ADDRESS":
				return get(ramComponent).flashAddress(get(main_address_bus).unsigned())
			case "DATA":
				return get(ramComponent).flashContent(get(main_address_bus).unsigned())
		}
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
