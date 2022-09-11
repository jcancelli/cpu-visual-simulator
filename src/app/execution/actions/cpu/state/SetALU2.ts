import { mux_alu_data_bus } from "../../../../store/busses"
import { cpu as cpuComponent } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import BinaryValue from "../../../../util/BinaryValue"
import CpuAction from "../CpuAction"

export default class SetALU2 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU2"
	}

	protected async action(): Promise<any> {
		cpuStore.get().alu2.set(new BinaryValue(16, mux_alu_data_bus.get().signed()))
		await cpuComponent.get().flash("ALU:2")
	}
}
