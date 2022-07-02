import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class JumpToIROperand extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.setIsJumping(true)
		cpuStore.setPC(state["IR:OPR"])
		await get(cpu).flash("PC")
		state["PC"] = state["IR:OPR"]
	}
}
