import symbolTableStore from "../store/symbolTableStore"
import { isSigned } from "../util/binaryUtil"
import BinaryValue from "../util/BinaryValue"
import { isImmediateFlagSet, removeFlags, setImmediateFlag } from "../util/instructionUtil"
import { isValidAddress } from "../util/ramUtil"
import Instruction from "./Instruction"
import { Opcode, opcode as parseOpcode } from "./Opcode"

export const BINARY = /^[01]{1,8}( [01]{1,8})?$/
export const DATA = /^-?[0-9]{1,3}$/
export const OPCODE = /[A-Z]{2,3}/
export const IMMEDIATE_NUM = /#-?[0-9]{1,3}/
export const DIRECT_PARAM = /[0-9]{1,3}/
export const LABEL_PARAM = /[A-Z_]{1,10}/
export const IMMEDIATE_LABEL = /#[A-Z_]{1,10}/
export const SYMBOLIC_INSTRUCTION = new RegExp(
	"^" +
		OPCODE.source +
		"( ((" +
		IMMEDIATE_NUM.source +
		")|(" +
		IMMEDIATE_LABEL.source +
		")|(" +
		DIRECT_PARAM.source +
		")|(" +
		LABEL_PARAM.source +
		")))?$"
)

export function parse(input: string, binaryExpected: boolean): Instruction {
	const isBinary = BINARY.test(input)
	const isInstruction = SYMBOLIC_INSTRUCTION.test(input)
	const isData = DATA.test(input)

	if (binaryExpected && !isBinary) {
		throw new Error("Invalid binary input")
	}
	if (!binaryExpected && !(isData || isInstruction)) {
		throw new Error("Invalid input")
	}

	if (isInstruction) {
		return parseInstruction(input)
	} else if (isBinary && binaryExpected) {
		// "&& binaryExpected" so it doesn't include data similar to binary (1, 10, 11, etc)
		return parseBinary(input)
	} else {
		// if isData
		return parseData(input)
	}
}

function parseInstruction(input: string): Instruction {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const hasOperand = !!symbolicOperand
	const opcode = parseOpcode(symbolicOpcode)
	if (!opcode) {
		throw new Error("Invalid opcode")
	}
	if (hasOperand) {
		if (!opcode.takesOperand) {
			throw new Error("Opcode doesn't allow operand")
		}
		if (IMMEDIATE_LABEL.test(symbolicOperand)) {
			return parseImmediateLabel(symbolicOpcode, symbolicOperand, opcode)
		} else if (LABEL_PARAM.test(symbolicOperand)) {
			return parseDirectLabel(symbolicOpcode, symbolicOperand, opcode)
		} else if (IMMEDIATE_NUM.test(symbolicOperand)) {
			return parseImmediateNumber(symbolicOpcode, symbolicOperand, opcode)
		} else {
			// DIRECT
			return parseDirect(symbolicOpcode, symbolicOperand, opcode)
		}
	} else {
		if (opcode.takesOperand) {
			throw new Error("Opcode requires operand")
		}
		return new Instruction(symbolicOpcode, "", BinaryValue.fromBytesValues([opcode.numeric, 0]))
	}
}

function parseDirectLabel(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	if (!symbolTableStore.hasLabel(symbolicOperand)) {
		throw new Error("Unknown label")
	}
	const address = symbolTableStore.getAddress(symbolicOperand)
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([opcode.numeric, address])
	)
}

function parseImmediateNumber(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	const numericOpcode = setImmediateFlag(new BinaryValue(8, opcode.numeric), true).signed()
	const numericOperand = parseInt(symbolicOperand.slice(1))
	if (!opcode.takesImmediate) {
		throw new Error("Opcode doesn't allow immediate operand")
	}
	if (!isSigned(numericOperand, 8)) {
		throw new Error("Operand is not a valid 8 bit signed value")
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([numericOpcode, numericOperand])
	)
}

function parseImmediateLabel(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	const label = symbolicOperand.slice(1)
	if (!symbolTableStore.hasLabel(label)) {
		throw new Error("Unknown label")
	}
	const numericOpcode = setImmediateFlag(new BinaryValue(8, opcode.numeric), true).signed()
	const numericOperand = symbolTableStore.getAddress(label)
	if (!opcode.takesImmediate) {
		throw new Error("Opcode doesn't allow immediate operand")
	}
	if (!isSigned(numericOperand, 8)) {
		throw new Error("Operand is not a valid 8 bit signed value")
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([numericOpcode, numericOperand])
	)
}

function parseDirect(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	const numericOperand = parseInt(symbolicOperand)
	if (!isValidAddress(numericOperand)) {
		throw new Error("Operand is not a valid address")
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([opcode.numeric, numericOperand])
	)
}

function parseBinary(input: string): Instruction {
	const [binaryOpcode, binaryOperand] = input.split(" ")
	const hasOperand = !!binaryOperand
	const opcodeValue = new BinaryValue(8, binaryOpcode)
	const operandValue = new BinaryValue(8, binaryOperand)
	const numericOpcode = opcodeValue.signed()
	const immediateFlagSet = isImmediateFlagSet(opcodeValue)
	const opcode = parseOpcode(removeFlags(opcodeValue))
	if (hasOperand) {
		if (!opcode) {
			throw new Error("Invalid opcode")
		}
		if (!opcode.takesOperand) {
			throw new Error("Opcode doesn't allow operand")
		}
		if (immediateFlagSet && !opcode.takesImmediate) {
			throw new Error("Opcode doesn't allow immediate operand")
		}
		const numericOperand = immediateFlagSet ? operandValue.signed() : operandValue.unsigned()
		const symbolicOperand = immediateFlagSet ? "#" + numericOperand : numericOperand.toString()
		if (!immediateFlagSet && !isValidAddress(numericOperand)) {
			throw new Error("Invalid address")
		}
		return new Instruction(
			opcode.symbolic,
			symbolicOperand,
			new BinaryValue(16, binaryOpcode + binaryOperand)
		)
	} else {
		const opcode = parseOpcode(removeFlags(opcodeValue))
		const immediateFlagSet = isImmediateFlagSet(opcodeValue)
		const invalidate = !opcode || (immediateFlagSet && !opcode.takesImmediate)
		const symbolicOpcode = !invalidate ? opcode.symbolic : numericOpcode.toString()
		const symbolicOperand = opcode && opcode.takesOperand ? (immediateFlagSet ? "#0" : "0") : ""
		return new Instruction(
			symbolicOpcode,
			symbolicOperand,
			new BinaryValue(16, binaryOpcode + binaryOperand),
			invalidate
		)
	}
}

function parseData(input: string): Instruction {
	const numericValue = parseInt(input)
	if (!isSigned(numericValue, 8)) {
		throw new Error("Input is not a valid 8 bit signed value")
	}
	const value = new BinaryValue(8, numericValue)
	const opcode = parseOpcode(removeFlags(value))
	const immediateFlagSet = isImmediateFlagSet(value)
	const invalidate =
		!opcode ||
		(immediateFlagSet && !opcode.takesImmediate) ||
		(immediateFlagSet && !opcode.takesOperand)
	return new Instruction(input, "", BinaryValue.fromBytesValues([numericValue, 0]), invalidate)
}
