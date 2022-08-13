import cpuStore from "../../../../store/cpu"
import { get } from "svelte/store"
import CpuAction from "../CpuAction"
import { cpu } from "../../../../store/components"

export default class UpdateSWCompare extends CpuAction {
	protected async action(): Promise<any> {
		const alu1 = get(cpuStore.alu1).signed()
		const alu2 = get(cpuStore.alu2).signed()
		const zeroFlag = get(cpuStore.zeroFlag)
		const negativeFlag = get(cpuStore.negativeFlag)

		const z = alu2 === alu1
		const n = alu2 > alu1

		if (z !== zeroFlag && n !== negativeFlag) {
			cpuStore.zeroFlag.set(z)
			cpuStore.negativeFlag.set(n)
			await Promise.all([get(cpu).flash("SW:Z"), get(cpu).flash("SW:N")])
		} else {
			if (z !== zeroFlag) {
				cpuStore.zeroFlag.set(z)
				await get(cpu).flash("SW:Z")
			}
			if (n !== negativeFlag) {
				cpuStore.negativeFlag.set(n)
				await get(cpu).flash("SW:N")
			}
		}
	}
}
