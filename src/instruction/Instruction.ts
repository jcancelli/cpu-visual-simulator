import BinaryValue from "../util/BinaryValue"
import { isImmediateFlagSet, removeFlags } from "../util/instructionUtil"
import { Opcode, opcode } from "./Opcode"

export default class Instruction {
	readonly value: BinaryValue
	readonly opcode: Opcode | undefined
	readonly symbolicOpcode: string
	readonly symbolicOperand: string

	constructor(symOpc: string, symOpr: string, value: BinaryValue, invalidate = false) {
		if (value.bits() !== 16) {
			throw new Error("Value must be 16 bit")
		}
		this.opcode = opcode(removeFlags(value))
		this.symbolicOpcode = symOpc
		this.symbolicOperand = symOpr
		this.value = value
		if (invalidate) {
			this.opcode = undefined
		}
	}

	immediateFlag(): boolean {
		return isImmediateFlagSet(this.value)
	}

	opcodeValue(): BinaryValue {
		return this.value.getByte(1)
	}

	operandValue(): BinaryValue {
		return this.value.getByte(2)
	}

	numericOpcode(): number {
		return this.value.getByte(1).signed()
	}

	numericOperand(): number {
		return this.immediateFlag() ? this.value.getByte(2).signed() : this.value.getByte(2).unsigned()
	}

	binaryOpcode(): string {
		return this.value.getByte(1).toBinaryString()
	}

	binaryOperand(): string {
		return this.value.getByte(2).toBinaryString()
	}
}
