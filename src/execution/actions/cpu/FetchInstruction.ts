import { get } from "svelte/store"
import { parse } from "../../../instruction/instructionParser"
import { main_data_bus } from "../../../store/busses"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import CpuAction from "./CpuAction"

export default class FetchInstruction extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.instructionRegister.set(parse(get(main_data_bus).toBinaryString(), true))
		await get(cpu).flash("IR")
	}
}
