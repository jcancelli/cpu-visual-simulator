import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class HaltExecution extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setIsHalting(true)
	}
}
