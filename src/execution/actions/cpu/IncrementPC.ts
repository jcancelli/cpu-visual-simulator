import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class IncrementPC extends CpuAction {
	protected async action(): Promise<any> {
		const pc = state["PC"] + state["INC"]
		cpuStore.setPC(pc)
		await get(cpu).flash("PC")
		state["PC"] = pc
	}
}
