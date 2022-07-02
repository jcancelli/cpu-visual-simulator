import cpuStore from "../../../store/cpu"
import CpuAction from "./CpuAction"

export default class ClearCpu extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.clear()
	}
}
