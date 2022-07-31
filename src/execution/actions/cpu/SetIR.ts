import { get } from "svelte/store"
import { parseBinary } from "../../../instruction/instructionParser"
import { main_data_bus } from "../../../store/busses"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import CpuAction from "./CpuAction"

export default class SetIR extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.instructionRegister.set(parseBinary(get(main_data_bus).toBinaryString()))
		await get(cpu).flash("IR")
	}
}
