import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class UpdateSW extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		const z = cache["ACC"] === 0
		const n = cache["ACC"] < 0
		cpuStore.setZeroFlag(z)
		cpuStore.setNegativeFlag(n)
		cache["SW:Z"] = z
		cache["SW:N"] = n
	}
}
