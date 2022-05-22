import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class IncrementPC extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		const pc = cache["PC"] + cache["INC"]
		cpuStore.setPC(pc)
		cache["PC"] = pc
	}
}
