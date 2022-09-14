import { parseBinary } from "../../../../util/instructionParser"
import { main_data_bus } from "../../../../store/busses"
import { cpu as cpuComponent } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetIR extends CpuAction {
	constructor() {
		super()
		this._name = "SetIR"
	}

	protected async action(): Promise<any> {
		cpuStore.get().instructionRegister.set(parseBinary(main_data_bus.get().toBinaryString()))
		await cpuComponent.get().flash("IR")
	}
}
