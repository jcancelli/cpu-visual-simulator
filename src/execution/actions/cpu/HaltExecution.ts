import cpuStore from "../../../store/cpuStore"
import CpuAction from "./CpuAction"

export default class HaltExecution extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.setIsHalting(true)
	}
}
