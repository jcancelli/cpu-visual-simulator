import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class SetAluOperation extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.setOperation(state["IR"].opcode.operator)
		await get(cpu).flash("ALU:OPR")
		state["ALU:OPR"] = state["IR"].opcode.operator
	}
}
