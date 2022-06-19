import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpuStore"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class ExecuteAluOperation extends CpuAction {
	protected async action(): Promise<any> {
		let result: number
		switch (state["ALU:OPR"]) {
			case "!":
				result = ~state["ALU:2"]
				break
			case "&":
				result = state["ALU:1"] & state["ALU:2"]
				break
			case "*":
				result = state["ALU:1"] * state["ALU:2"]
				break
			case "+":
				result = state["ALU:1"] + state["ALU:2"]
				break
			case "-":
				result = state["ALU:1"] - state["ALU:2"]
				break
			case "/":
				if (state["ALU:2"] === 0) {
					throw new Error("Division by zero")
				}
				result = state["ALU:1"] / state["ALU:2"]
				break
			case "=":
				result = state["ALU:2"]
				break
			case ":":
			case "":
			default:
				throw new Error(`Operator "${state["ALU:OP"]}" doesn't set the Accumulator`)
		}
		cpuStore.setACC(result)
		await get(cpu).flash("ACC")
		state["ACC"] = result
	}
}
