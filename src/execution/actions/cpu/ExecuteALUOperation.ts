import { get } from "svelte/store"
import cpuStore from "../../../store/cpu"
import BinaryValue from "../../../util/BinaryValue"
import CpuAction from "./CpuAction"

export default class ExecuteALUOperation extends CpuAction {
	protected async action(): Promise<any> {
		const operation = get(cpuStore.aluOperation)
		const alu1 = get(cpuStore.alu1).signed()
		const alu2 = get(cpuStore.alu2).signed()

		let result: number

		switch (operation) {
			case "!":
				result = ~alu2
				break
			case "&":
				result = alu1 & alu2
				break
			case "*":
				result = alu1 * alu2
				break
			case "+":
				result = alu1 + alu2
				break
			case "-":
				result = alu1 - alu2
				break
			case "/":
				if (alu2 === 0) {
					throw new Error("Division by zero")
				}
				result = alu1 / alu2
				break
			case "=":
				result = alu2
				break
			case ":":
			case "":
			default:
				throw new Error(`Unexpected ALU operation: "${operation}"`)
		}

		cpuStore.aluResult.set(new BinaryValue(16, result))
	}
}
