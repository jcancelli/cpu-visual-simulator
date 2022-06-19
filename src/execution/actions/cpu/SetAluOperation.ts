import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class SetAluOperation extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setOperation(cache["IR"].opcode.operator)
		await get(cpu).flash("ALU:OPR")
		cache["ALU:OPR"] = cache["IR"].opcode.operator
	}
}
