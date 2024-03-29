import CheckedError from "../../../../errors/CheckedError"
import text from "../../../../store/text"
import BinaryValue from "../../../../model/BinaryValue"
import CpuAction from "../CpuAction"
import { ExecutionContext } from "../../../ExecutionContext"

export default class ExecuteALUOperation extends CpuAction {
	constructor() {
		super()
		this._name = "ExecuteALUOperation"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		const cpu = ctx.cpu.model

		const operation = cpu.aluOperation.get()
		const alu1 = cpu.alu1.get().signed()
		const alu2 = cpu.alu2.get().signed()

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
					throw new CheckedError(text.get().errors.execution.division_by_zero)
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
		cpu.aluResult.set(new BinaryValue(16, result))
	}
}
