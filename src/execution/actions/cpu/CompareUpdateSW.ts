import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import { get } from "svelte/store"
import CpuAction from "./CpuAction"
import { cpu } from "../../../store/componentsStore"

export default class CompareUpdateSW extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		const z = cache["ALU:2"] === cache["ALU:1"]
		const n = cache["ALU:2"] > cache["ALU:1"]
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
		cache["SW:Z"] = z
		cache["SW:N"] = n
	}
}
