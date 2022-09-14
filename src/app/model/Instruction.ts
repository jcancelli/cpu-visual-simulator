import BinaryValue from "../model/BinaryValue"
import { isImmediateFlagSet, removeFlags } from "../util/instruction"
import { Opcode, opcode } from "./InstructionSet"

/** Represents a value stored in the ram */
export default class Instruction extends BinaryValue {
	/** The opcode of the instruction. If undefined the instruction is considered invalid (not executable) */
	readonly opcode: Opcode | undefined
	readonly symbolicOpcode: string
	readonly symbolicOperand: string

	static readonly NOP: Instruction = new Instruction("NOP", "", new BinaryValue(16, opcode("NOP").numeric))

	/**
	 * @param {string} symOpc - The symbolic representation of the first byte of the instruction
	 * @param {string} symOpr - The symbolic representation of the second byte of the instruction
	 * @param {BinaryValue} value - The numberic value of the instruction
	 * @param {boolean} invalidate - If set to true invalidates the instruction, setting its opcode to undefined. false by default
	 */
	constructor(symOpc: string, symOpr: string, value: BinaryValue, invalidate = false) {
		super(16, value)
		this.opcode = opcode(removeFlags(value))
		this.symbolicOpcode = symOpc
		this.symbolicOperand = symOpr
		if (invalidate) {
			this.opcode = undefined
		}
	}

	/**
	 * Returns true if the immediate flag of its instance is set
	 * @returns {boolean}
	 */
	immediateFlag(): boolean {
		return isImmediateFlagSet(this)
	}

	/**
	 * Returns the first byte (the byte representing the opcode) of its instance
	 * @returns {BinaryValue}
	 */
	opcodeValue(): BinaryValue {
		return this.getByte(1)
	}

	/**
	 * Returns the second byte (the byte representing the operand) of its instance
	 * @returns {BinaryValue}
	 */
	operandValue(): BinaryValue {
		return this.getByte(2)
	}

	/**
	 * Returns the numeric value (signed) of the first byte (the byte representing the opcode) of its instance
	 * @returns {number}
	 */
	numericOpcode(): number {
		return this.getByte(1).signed()
	}

	/**
	 * Returns the numeric value (signed if the immediate flag is set, unsigned otherwise)
	 * of the second byte (the byte representing the operand) of its instance
	 * @returns {number}
	 */
	numericOperand(): number {
		return this.immediateFlag() ? this.getByte(2).signed() : this.getByte(2).unsigned()
	}

	/**
	 * Returns a binary string representing the first byte (the byte representing the opcode) of its instance
	 * @returns {string}
	 */
	binaryOpcode(): string {
		return this.getByte(1).toBinaryString()
	}

	/**
	 * Returns a binary string representing the second byte (the byte representing the operand) of its instance
	 * @returns {string}
	 */
	binaryOperand(): string {
		return this.getByte(2).toBinaryString()
	}

	/**
	 * Returns the symbolic representation of its instance
	 * @returns {string}
	 */
	symbolic(): string {
		return this.symbolicOpcode + (this.symbolicOperand !== "" ? ` ${this.symbolicOperand}` : "")
	}
}
