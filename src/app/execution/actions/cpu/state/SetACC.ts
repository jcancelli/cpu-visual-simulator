import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore, wiresStore } from "../../../../store/state"
import CpuAction from "../CpuAction"

export default class SetACC extends CpuAction {
	constructor() {
		super()
		this._name = "SetACC"
	}

	protected async action(): Promise<any> {
		cpuStore.get().accumulator.set(wiresStore.get().data_alu_acc.get())
		await cpuComponent.get().flash("ACC")
	}
}
