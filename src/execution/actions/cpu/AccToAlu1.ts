import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class AccToAlu1 extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		cpuStore.setALU1(cache["ACC"])
		cache["ALU:1"] = cache["ACC"]
	}
}
