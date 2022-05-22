import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class JumpToIROperand extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setIsJumping(true)
		cpuStore.setPC(cache["IR:OPR"])
		cache["PC"] = cache["IR:OPR"]
	}
}
