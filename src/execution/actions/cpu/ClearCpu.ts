import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class ClearCpu extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.clear()
	}
}
