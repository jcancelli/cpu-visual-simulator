import { get } from "svelte/store"
import { cpu } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class UpdateSW extends CpuAction {
	constructor() {
		super()
		this._name = "UpdateSW"
	}

	protected async action(): Promise<any> {
		const acc = get(cpuStore.accumulator).signed()
		const zeroFlag = get(cpuStore.zeroFlag)
		const negativeFlag = get(cpuStore.negativeFlag)

		const z = acc === 0
		const n = acc < 0

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
