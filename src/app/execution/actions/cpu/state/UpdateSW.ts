import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore } from "../../../../store/state"
import CpuAction from "../CpuAction"

export default class UpdateSW extends CpuAction {
	constructor() {
		super()
		this._name = "UpdateSW"
	}

	protected async action(): Promise<any> {
		const cpu = cpuStore.get()
		const acc = cpu.accumulator.get().signed()
		const zeroFlag = cpu.zeroFlag.get()
		const negativeFlag = cpu.negativeFlag.get()

		const z = acc === 0
		const n = acc < 0

		if (z !== zeroFlag && n !== negativeFlag) {
			cpu.zeroFlag.set(z)
			cpu.negativeFlag.set(n)
			await Promise.all([cpuComponent.get().flash("SW:Z"), cpuComponent.get().flash("SW:N")])
		} else {
			if (z !== zeroFlag) {
				cpu.zeroFlag.set(z)
				await cpuComponent.get().flash("SW:Z")
			}
			if (n !== negativeFlag) {
				cpu.negativeFlag.set(n)
				await cpuComponent.get().flash("SW:N")
			}
		}
	}
}
