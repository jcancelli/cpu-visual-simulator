import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpuStore"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class AccToAlu1 extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.setALU1(state["ACC"])
		await get(cpu).flash("ALU:1")
		state["ALU:1"] = state["ACC"]
	}
}
