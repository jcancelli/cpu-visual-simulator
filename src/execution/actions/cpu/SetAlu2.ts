import cpuStore from "../../../store/cpuStore"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class SetAlu2 extends CpuAction {
	protected value: "IR:OPR" | "RAM"

	constructor(value: "IR:OPR" | "RAM") {
		super()
		this.value = value
	}

	protected async action(cache: Cache): Promise<any> {
		switch (this.value) {
			case "IR:OPR":
				cpuStore.setALU2(cache["IR"].numericOperand)
				cache["ALU:2"] = cache["IR"].numericOperand
				break
			case "RAM":
				cpuStore.setALU2(cache["RAM"].data.numericOpcode)
				cache["ALU:2"] = cache["RAM"].data.numericOpcode
				break
			default:
				throw new Error(`Unexpected value "${this.value}"`)
		}
	}
}
