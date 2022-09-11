import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"
import { cpu as cpuComponent } from "../../../../store/components"

export default class UpdateSWCompare extends CpuAction {
	constructor() {
		super()
		this._name = "UpdateSWCompare"
	}

	protected async action(): Promise<any> {
		const cpu = cpuStore.get()

		const alu1 = cpu.alu1.get().signed()
		const alu2 = cpu.alu2.get().signed()
		const zeroFlag = cpu.zeroFlag.get()
		const negativeFlag = cpu.negativeFlag.get()

		const z = alu2 === alu1
		const n = alu2 > alu1

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
