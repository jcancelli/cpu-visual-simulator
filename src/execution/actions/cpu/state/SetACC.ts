import { get } from "svelte/store"
import { alu_acc_data_bus } from "../../../../store/busses"
import { cpu } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetACC extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.accumulator.set(get(alu_acc_data_bus))
		await get(cpu).flash("ACC")
	}
}
