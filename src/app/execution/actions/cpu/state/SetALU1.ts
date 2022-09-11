import { main_data_bus } from "../../../../store/busses"
import { cpu as cpuComponent } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetALU1 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU1"
	}

	protected async action(): Promise<any> {
		cpuStore.get().alu1.set(main_data_bus.get())
		await cpuComponent.get().flash("ALU:1")
	}
}
