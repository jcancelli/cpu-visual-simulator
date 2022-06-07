import { get } from "svelte/store"
import { cpu } from "../../../store/componentsStore"
import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class FetchInstruction extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setIR(cache["RAM"].data)
		await get(cpu).flash("IR")
		cache["IR"] = cache["RAM"].data
		cache["IR:OPC"] = cache["IR"].numericOpcode()
		cache["IR:OPR"] = cache["IR"].numericOperand()
	}
}
