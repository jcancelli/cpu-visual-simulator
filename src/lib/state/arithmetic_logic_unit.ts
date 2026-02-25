import type { OpcodeRegister } from "$lib/register/opcode"
import type { WordRegister } from "$lib/register/register.svelte"
import type { StatusWordRegister } from "./status_word_register"

/** State of the arithmetic-logic unit */
export class ArithmeticLogicUnit {
	/** The first operand for the current operation */
	public readonly operand1: WordRegister
	/** The second operand for the current operation */
	public readonly operand2: WordRegister
	/** The numeric opcode of the operation currently selected */
	public readonly operation: OpcodeRegister
	/** The result of the last operation */
	public readonly result: WordRegister
	/** Value of the status word that was either updated by the last operation or read from the status word bus */
	public readonly statusWord: StatusWordRegister

	constructor(
		operand1Register: WordRegister,
		operand2Register: WordRegister,
		operationRegister: OpcodeRegister,
		resultRegister: WordRegister,
		statusWordRegister: StatusWordRegister,
	) {
		this.operand1 = operand1Register
		this.operand2 = operand2Register
		this.operation = operationRegister
		this.result = resultRegister
		this.statusWord = statusWordRegister
	}
}
