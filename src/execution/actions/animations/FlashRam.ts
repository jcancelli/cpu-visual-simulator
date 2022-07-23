import Animation from "./Animation"
import { get } from "svelte/store"
import { ram as ramComponent } from "../../../store/components"
import state, { Key as StateKey } from "../../state"

export type FlashableRamComponent = "ADDRESS" | "DATA"

export default class FlashRam extends Animation {
	protected component: FlashableRamComponent
	protected address: number | StateKey

	constructor(component: FlashableRamComponent, address: number | StateKey) {
		super()
		this.component = component
		this.address = address
	}

	protected async action(): Promise<any> {
		const ram = get(ramComponent)
		const address =
			typeof this.address === "number" ? this.address : (state[this.address] as number)
		if (typeof address !== "number") {
			throw new Error(this.address + " is not a number")
		}
		switch (this.component) {
			case "ADDRESS":
				return ram.flashAddress(address)
			case "DATA":
				return ram.flashContent(address)
		}
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}, address: ${this.address}`
	}
}
