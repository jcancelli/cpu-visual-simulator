import { get } from "svelte/store"
import { cpu } from "../../../store/componentsStore"
import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class JumpToIROperand extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setIsJumping(true)
		cpuStore.setPC(cache["IR:OPR"])
		await get(cpu).flash("PC")
		cache["PC"] = cache["IR:OPR"]
	}
}
