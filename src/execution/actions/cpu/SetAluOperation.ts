import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class SetAluOperation extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setOperation(cache["IR"].opcode.operator)
		cache["ALU:OPR"] = cache["IR"].opcode.operator
	}
}
