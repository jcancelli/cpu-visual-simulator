import { get } from "svelte/store"
import { cpu } from "../../../store/componentsStore"
import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class AccToAlu1 extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setALU1(cache["ACC"])
		await get(cpu).flash("ALU:1")
		cache["ALU:1"] = cache["ACC"]
	}
}
