import Animation from "./Animation"
import { get } from "svelte/store"
import components from "../../../store/componentsStore"
import { Cache, CacheableKey } from "../../execution"

export type FlashableRamComponent = "ADDRESS" | "DATA"

export default class FlashRam extends Animation {
	protected component: FlashableRamComponent
	protected address: number | CacheableKey

	constructor(component: FlashableRamComponent, address: number | CacheableKey) {
		super()
		this.component = component
		this.address = address
	}

	protected async action(cache: Cache): Promise<any> {
		const ram = get(components.ram)
		const address = typeof this.address === "number" ? this.address : cache[this.address]
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
