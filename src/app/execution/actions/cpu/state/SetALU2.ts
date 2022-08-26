import { get } from "svelte/store"
import { mux_alu_data_bus } from "../../../../store/busses"
import { cpu } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetALU2 extends CpuAction {
	constructor() {
		super()
		this._name = "SetALU2"
	}

	protected async action(): Promise<any> {
		cpuStore.alu2.set(get(mux_alu_data_bus))
		await get(cpu).flash("ALU:2")
	}
}
