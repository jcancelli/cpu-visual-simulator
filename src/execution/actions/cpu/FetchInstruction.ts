import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import { state } from "../../state"
import CpuAction from "./CpuAction"

export default class FetchInstruction extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.setIR(state["RAM"].data)
		await get(cpu).flash("IR")
		state["IR"] = state["RAM"].data
		state["IR:OPC"] = state["IR"].numericOpcode()
		state["IR:OPR"] = state["IR"].numericOperand()
	}
}
