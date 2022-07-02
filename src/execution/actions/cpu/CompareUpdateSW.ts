import cpuStore from "../../../store/cpu"
import { get } from "svelte/store"
import CpuAction from "./CpuAction"
import { cpu } from "../../../store/components"
import state from "../../state"

export default class CompareUpdateSW extends CpuAction {
	protected async action(): Promise<any> {
		const z = state["ALU:2"] === state["ALU:1"]
		const n = state["ALU:2"] > state["ALU:1"]
		if (z !== get(cpuStore).zeroFlag && n !== get(cpuStore).negativeFlag) {
			cpuStore.setZeroFlag(z)
			cpuStore.setNegativeFlag(n)
			await Promise.all([get(cpu).flash("SW:Z"), get(cpu).flash("SW:N")])
		} else {
			if (z !== get(cpuStore).zeroFlag) {
				cpuStore.setZeroFlag(z)
				await get(cpu).flash("SW:Z")
			}
			if (n !== get(cpuStore).negativeFlag) {
				cpuStore.setNegativeFlag(n)
				await get(cpu).flash("SW:N")
			}
		}
		state["SW:Z"] = z
		state["SW:N"] = n
	}
}
