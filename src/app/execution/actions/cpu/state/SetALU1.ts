import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore, wiresStore } from "../../../../store/state"
import CpuAction from "../CpuAction"

export default class SetALU1 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU1"
	}

	protected async action(): Promise<any> {
		cpuStore.get().alu1.set(wiresStore.get().data_main.get())
		await cpuComponent.get().flash("ALU:1")
	}
}
