import { inc_pc_address_bus } from "../../../../store/busses"
import { cpu as cpuComponent } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import BinaryValue from "../../../../util/BinaryValue"
import CpuAction from "../CpuAction"

export default class IncrementPC extends CpuAction {
	constructor() {
		super()
		this._name = "IncrementPC"
	}

	protected async action(): Promise<any> {
		const cpu = cpuStore.get()
		const newValue = cpu.programCounter.get().unsigned() + inc_pc_address_bus.get().unsigned()
		cpu.programCounter.set(new BinaryValue(8, newValue))
		await cpuComponent.get().flash("PC")
	}
}
