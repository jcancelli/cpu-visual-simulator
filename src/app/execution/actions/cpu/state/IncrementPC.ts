import { get } from "svelte/store"
import { inc_pc_address_bus } from "../../../../store/busses"
import { cpu } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import BinaryValue from "../../../../util/BinaryValue"
import CpuAction from "../CpuAction"

export default class IncrementPC extends CpuAction {
	constructor() {
		super()
		this._name = "IncrementPC"
	}

	protected async action(): Promise<any> {
		const newValue = get(cpuStore.programCounter).unsigned() + get(inc_pc_address_bus).unsigned()
		cpuStore.programCounter.set(new BinaryValue(8, newValue))
		await get(cpu).flash("PC")
	}
}
