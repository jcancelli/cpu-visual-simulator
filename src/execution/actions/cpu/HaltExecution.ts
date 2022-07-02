import cpuStore from "../../../store/cpu"
import CpuAction from "./CpuAction"

export default class HaltExecution extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.setIsHalting(true)
	}
}
