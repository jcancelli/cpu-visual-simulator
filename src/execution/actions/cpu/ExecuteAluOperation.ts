import cpuStore from "../../../store/cpuStore"
import { handleOverflowUnderflow } from "../../../util/binaryUtil"
import { Cache } from "../../execution"
import CpuAction from "./CpuAction"

export default class ExecuteAluOperation extends CpuAction {
	protected async action(cache: Cache): Promise<any> {
		let result: number
		switch (cache["ALU:OPR"]) {
			case "!":
				result = ~cache["ALU:2"]
				break
			case "&":
				result = cache["ALU:1"] & cache["ALU:2"]
				break
			case "*":
				result = cache["ALU:1"] * cache["ALU:2"]
				break
			case "+":
				result = cache["ALU:1"] + cache["ALU:2"]
				break
			case "-":
				result = cache["ALU:1"] - cache["ALU:2"]
				break
			case "/":
				if (cache["ALU:2"] === 0) {
					throw new Error("Division by zero")
				}
				result = cache["ALU:1"] / cache["ALU:2"]
				break
			case "=":
				result = cache["ALU:2"]
				break
			case ":":
			case "":
			default:
				throw new Error(`Operator "${cache["ALU:OP"]}" doesn't set the Accumulator`)
		}
		cpuStore.setACC(handleOverflowUnderflow(result))
		cache["ACC"] = result
	}
}
