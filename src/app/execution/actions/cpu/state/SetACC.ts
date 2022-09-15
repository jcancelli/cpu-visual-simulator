import { alu_acc_data_bus } from "../../../../store/busses"
import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore } from "../../../../store/state"
import CpuAction from "../CpuAction"

export default class SetACC extends CpuAction {
	constructor() {
		super()
		this._name = "SetACC"
	}

	protected async action(): Promise<any> {
		cpuStore.get().accumulator.set(alu_acc_data_bus.get())
		await cpuComponent.get().flash("ACC")
	}
}
