import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpuStore"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class UpdateSW extends CpuAction {
	protected async action(): Promise<any> {
		const z = state["ACC"] === 0
		const n = state["ACC"] < 0
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
