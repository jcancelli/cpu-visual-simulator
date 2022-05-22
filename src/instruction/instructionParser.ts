import symbolTableStore from "../store/symbolTableStore"
import {
	binaryToSigned8bit,
	binaryToUnsigned8bit,
	isValidSigned8bit,
	pad,
	signedToBinary8bit,
	unsignedToBinary8bit
} from "../util/binaryUtil"
import { immediateFlag, removeFlags, setImmediateFlag } from "../util/instructionUtil"
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
		return new Instruction(
			symbolicOpcode,
			"",
			signedToBinary8bit(opcode.numeric),
			"00000000",
			opcode.numeric,
			0
		)
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
		signedToBinary8bit(opcode.numeric),
		unsignedToBinary8bit(address),
		opcode.numeric,
		address
	)
}

function parseImmediateNumber(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	const numericOpcode = setImmediateFlag(opcode.numeric, true) as number
	const numericOperand = parseInt(symbolicOperand.slice(1))
	if (!opcode.takesImmediate) {
		throw new Error("Opcode doesn't allow immediate operand")
	}
	if (!isValidSigned8bit(numericOperand)) {
		throw new Error("Operand is not a valid 8 bit signed value")
	}
	const binaryOpcode = signedToBinary8bit(numericOpcode)
	const binaryOperand = signedToBinary8bit(numericOperand)
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		binaryOpcode,
		binaryOperand,
		numericOpcode,
		numericOperand
	)
}

function parseImmediateLabel(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	const label = symbolicOperand.slice(1)
	if (!symbolTableStore.hasLabel(label)) {
		throw new Error("Unknown label")
	}
	const numericOpcode = setImmediateFlag(opcode.numeric, true) as number
	const numericOperand = symbolTableStore.getAddress(label)
	if (!opcode.takesImmediate) {
		throw new Error("Opcode doesn't allow immediate operand")
	}
	if (!isValidSigned8bit(numericOperand)) {
		throw new Error("Operand is not a valid 8 bit signed value")
	}
	const binaryOpcode = signedToBinary8bit(numericOpcode)
	const binaryOperand = signedToBinary8bit(numericOperand)
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		binaryOpcode,
		binaryOperand,
		numericOpcode,
		numericOperand
	)
}

function parseDirect(symbolicOpcode: string, symbolicOperand: string, opcode: Opcode) {
	const numericOpcode = opcode.numeric
	const numericOperand = parseInt(symbolicOperand)
	if (!isValidAddress(numericOperand)) {
		throw new Error("Operand is not a valid address")
	}
	const binaryOpcode = signedToBinary8bit(numericOpcode)
	const binaryOperand = unsignedToBinary8bit(numericOperand)
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		binaryOpcode,
		binaryOperand,
		numericOpcode,
		numericOperand
	)
}

function parseBinary(input: string): Instruction {
	const [binaryOpcode, binaryOperand] = input.split(" ")
	const hasOperand = !!binaryOperand
	const numericOpcode = binaryToSigned8bit(binaryOpcode)
	const immediateFlagSet = immediateFlag(numericOpcode)
	const opcode = parseOpcode(setImmediateFlag(numericOpcode, false))
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
		const numericOperand = immediateFlagSet
			? binaryToSigned8bit(binaryOperand)
			: binaryToUnsigned8bit(binaryOperand)
		const symbolicOperand = immediateFlagSet ? "#" + numericOperand : numericOperand.toString()
		if (!immediateFlagSet && !isValidAddress(numericOperand)) {
			throw new Error("Invalid address")
		}
		return new Instruction(
			opcode.symbolic,
			symbolicOperand,
			pad(binaryOpcode),
			pad(binaryOperand),
			numericOpcode,
			numericOperand
		)
	} else {
		const opcode = parseOpcode(removeFlags(numericOpcode))
		const immediateFlagSet = immediateFlag(binaryOpcode)
		const invalidate = !opcode || (immediateFlagSet && !opcode.takesImmediate)
		const symbolicOpcode = !invalidate ? opcode.symbolic : numericOpcode.toString()
		const symbolicOperand = opcode && opcode.takesOperand ? (immediateFlagSet ? "#0" : "0") : ""
		return new Instruction(
			symbolicOpcode,
			symbolicOperand,
			pad(binaryOpcode),
			"00000000",
			numericOpcode,
			0,
			invalidate
		)
	}
}

function parseData(input: string): Instruction {
	const numericValue = parseInt(input)
	if (!isValidSigned8bit(numericValue)) {
		throw new Error("Input is not a valid 8 bit signed value")
	}
	const binaryValue = signedToBinary8bit(numericValue)
	const opcode = parseOpcode(removeFlags(numericValue))
	const immediateFlagSet = immediateFlag(numericValue)
	const invalidate =
		!opcode ||
		(immediateFlagSet && !opcode.takesImmediate) ||
		(immediateFlagSet && !opcode.takesOperand)
	return new Instruction(input, "", binaryValue, "00000000", numericValue, 0, invalidate)
}
