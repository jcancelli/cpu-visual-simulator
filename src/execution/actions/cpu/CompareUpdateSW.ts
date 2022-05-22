import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class CompareUpdateSW extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		const z = cache["ALU:2"] === cache["ALU:1"]
		const n = cache["ALU:2"] > cache["ALU:1"]
		cpuStore.setZeroFlag(z)
		cpuStore.setNegativeFlag(n)
		cache["SW:Z"] = z
		cache["SW:N"] = n
	}
}
