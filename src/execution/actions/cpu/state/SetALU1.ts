import { get } from "svelte/store"
import { main_data_bus } from "../../../../store/busses"
import { cpu } from "../../../../store/components"
import { alu1 } from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetALU1 extends CpuAction {
	protected async action(): Promise<any> {
		alu1.set(get(main_data_bus))
		await get(cpu).flash("ALU:1")
	}
}
