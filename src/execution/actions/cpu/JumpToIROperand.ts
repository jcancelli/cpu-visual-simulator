import { get } from "svelte/store"
import { main_address_bus } from "../../../store/busses"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import CpuAction from "./CpuAction"

export default class JumpToIROperand extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.isJumping.set(true)
		cpuStore.programCounter.set(get(main_address_bus))
		await get(cpu).flash("PC")
	}
}
