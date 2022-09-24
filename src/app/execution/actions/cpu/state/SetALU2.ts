import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore, wiresStore } from "../../../../store/state"
import BinaryValue from "../../../../model/BinaryValue"
import CpuAction from "../CpuAction"

export default class SetALU2 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU2"
	}

	protected async action(): Promise<any> {
		cpuStore.get().alu2.set(new BinaryValue(16, wiresStore.get().data_mux_alu.get().signed()))
		await cpuComponent.get().flash("ALU:2")
	}
}
