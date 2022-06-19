import cpuStore from "../../../store/cpuStore"
import CpuAction from "./CpuAction"

export default class ClearCpu extends CpuAction {
	protected async action(): Promise<any> {
		cpuStore.clear()
	}
}
