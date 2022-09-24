import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore, wiresStore } from "../../../../store/state"
import CpuAction from "../CpuAction"

export default class SetPC extends CpuAction {
	constructor() {
		super()
		this._name = "SetPC"
	}

	protected async action(): Promise<any> {
		const cpu = cpuStore.get()
		cpu.isJumping.set(true)
		cpu.programCounter.set(wiresStore.get().addr_main.get())
		await cpuComponent.get().flash("PC")
	}
}
