import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore, wiresStore } from "../../../../store/state"
import { parseBinary } from "../../../../util/instructionParser"
import CpuAction from "../CpuAction"

export default class SetIR extends CpuAction {
	constructor() {
		super()
		this._name = "SetIR"
	}

	protected async action(): Promise<any> {
		cpuStore.get().instructionRegister.set(parseBinary(wiresStore.get().data_main.get().toBinaryString()))
		await cpuComponent.get().flash("IR")
	}
}
