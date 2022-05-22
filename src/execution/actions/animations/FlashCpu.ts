import { get } from "svelte/store"
import { FlashableCpuComponent } from "../../../components/cpu/Cpu.svelte"
import components from "../../../store/componentsStore"
import { Cache } from "../../execution"
import Animation from "./Animation"

export default class FlashCpu extends Animation {
	protected component: FlashableCpuComponent

	constructor(component: FlashableCpuComponent) {
		super()
		this.component = component
	}

	protected async action(cache: Cache): Promise<any> {
		return get(components.cpu).flash(this.component)
	}

	toString(): string {
		return `${super.toString()}, component: ${this.component}`
	}
}
