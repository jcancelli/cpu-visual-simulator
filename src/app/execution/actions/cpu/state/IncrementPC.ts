import { cpu as cpuComponent } from "../../../../store/components"
import { cpuStore, wiresStore } from "../../../../store/state"
import BinaryValue from "../../../../model/BinaryValue"
import CpuAction from "../CpuAction"

export default class IncrementPC extends CpuAction {
	constructor() {
		super()
		this._name = "IncrementPC"
	}

	protected async action(): Promise<any> {
		const cpu = cpuStore.get()
		const newValue = cpu.programCounter.get().unsigned() + wiresStore.get().addr_inc_pc.get().unsigned()
		cpu.programCounter.set(new BinaryValue(8, newValue))
		await cpuComponent.get().flash("PC")
	}
}
