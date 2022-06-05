import InstructionParsingError from "../errors/InstructionParsingError"
import symbolTableStore from "../store/symbolTableStore"
import { isSigned, pad } from "../util/binaryUtil"
import BinaryValue from "../util/BinaryValue"
import { isImmediateFlagSet, removeFlags, setImmediateFlag } from "../util/instructionUtil"
import { isValidAddress } from "../util/ramUtil"
import Instruction from "./Instruction"
import { Opcode, opcode as parseOpcode } from "./Opcode"

export const BINARY = /^[01]{0,8}\s?[01]{1,8}?$/
export const DATA = /^-?[0-9]{1,5}$/
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
		throw new InstructionParsingError("Invalid binary input", input)
	}
	if (!binaryExpected && !(isData || isInstruction)) {
		throw new InstructionParsingError("Invalid input", input)
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
		throw new InstructionParsingError("Invalid opcode", input)
	}
	if (hasOperand) {
		if (!opcode.takesOperand) {
			throw new InstructionParsingError("Opcode doesn't allow operand", input)
		}
		if (IMMEDIATE_LABEL.test(symbolicOperand)) {
			return parseImmediateLabel(input, opcode)
		} else if (LABEL_PARAM.test(symbolicOperand)) {
			return parseDirectLabel(input, opcode)
		} else if (IMMEDIATE_NUM.test(symbolicOperand)) {
			return parseImmediateNumber(input, opcode)
		} else {
			// DIRECT
			return parseDirect(input, opcode)
		}
	} else {
		if (opcode.takesOperand) {
			throw new InstructionParsingError("Opcode requires operand", input)
		}
		return new Instruction(symbolicOpcode, "", BinaryValue.fromBytesValues([opcode.numeric, 0]))
	}
}

function parseDirectLabel(input: string, opcode: Opcode) {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	if (!symbolTableStore.hasLabel(symbolicOperand)) {
		throw new InstructionParsingError("Unknown label", input)
	}
	const address = symbolTableStore.getAddress(symbolicOperand)
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([opcode.numeric, address])
	)
}

function parseImmediateNumber(input: string, opcode: Opcode) {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const numericOpcode = setImmediateFlag(new BinaryValue(8, opcode.numeric), true).signed()
	const numericOperand = parseInt(symbolicOperand.slice(1))
	if (!opcode.takesImmediate) {
		throw new InstructionParsingError("Opcode doesn't allow immediate operand", input)
	}
	if (!isSigned(numericOperand, 8)) {
		throw new InstructionParsingError("Operand is not a valid 8 bit signed value", input)
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([numericOpcode, numericOperand])
	)
}

function parseImmediateLabel(input: string, opcode: Opcode) {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const label = symbolicOperand.slice(1)
	if (!symbolTableStore.hasLabel(label)) {
		throw new InstructionParsingError("Unknown label", input)
	}
	const numericOpcode = setImmediateFlag(new BinaryValue(8, opcode.numeric), true).signed()
	const numericOperand = symbolTableStore.getAddress(label)
	if (!opcode.takesImmediate) {
		throw new InstructionParsingError("Opcode doesn't allow immediate operand", input)
	}
	if (!isSigned(numericOperand, 8)) {
		throw new InstructionParsingError("Operand is not a valid 8 bit signed value", input)
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([numericOpcode, numericOperand])
	)
}

function parseDirect(input: string, opcode: Opcode) {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const numericOperand = parseInt(symbolicOperand)
	if (!isValidAddress(numericOperand)) {
		throw new InstructionParsingError("Operand is not a valid address", input)
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytesValues([opcode.numeric, numericOperand])
	)
}

function parseBinary(input: string): Instruction {
	if (input.includes(" ")) {
		const [opc, opr] = input.split(" ")
		input = opc + pad(opr, 8)
	}
	const value = new BinaryValue(16, input)
	const opcodeValue = value.getByte(1)
	const operandValue = value.getByte(2)
	const immediateFlagSet = isImmediateFlagSet(opcodeValue)
	const opcode = parseOpcode(removeFlags(opcodeValue))
	let invalidate = false
	if (!opcode) {
		invalidate = true
	} else if (!opcode.takesOperand) {
		invalidate = true
	} else if (immediateFlagSet && !opcode.takesImmediate) {
		invalidate = true
	} else if (!immediateFlagSet && !isValidAddress(operandValue.unsigned())) {
		invalidate = true
	}
	const symbolicOpcode = invalidate ? value.signed().toString() : opcode.symbolic
	let symbolicOperand = immediateFlagSet
		? "#" + operandValue.signed()
		: operandValue.unsigned().toString()
	if (invalidate) {
		symbolicOperand = ""
	}
	return new Instruction(symbolicOpcode, symbolicOperand, value, invalidate)
}

function parseData(input: string): Instruction {
	const numericValue = parseInt(input)
	if (!isSigned(numericValue, 16)) {
		throw new InstructionParsingError("Input is not a valid 16 bit signed value", input)
	}
	const value = new BinaryValue(16, numericValue)
	const opcodeValue = value.getByte(1)
	const opcode = parseOpcode(removeFlags(opcodeValue))
	const immediateFlagSet = isImmediateFlagSet(opcodeValue)
	const invalidate =
		!opcode ||
		(immediateFlagSet && !opcode.takesImmediate) ||
		(immediateFlagSet && !opcode.takesOperand)
	return new Instruction(input, "", value, invalidate)
}
