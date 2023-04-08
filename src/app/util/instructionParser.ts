import { isImmediateFlagSet, removeFlags, setImmediateFlag } from "./instruction"
import InstructionParsingError from "../errors/InstructionParsingError"
import { Opcode, opcode as parseOpcode, opcodes } from "../model/InstructionSet"
import BinaryValue from "../model/BinaryValue"
import Instruction from "../model/Instruction"
import SymbolTable from "../model/SymbolTable"
import { isSigned, pad } from "./binary"
import { isValidAddress } from "./ram"
import text from "../store/text"
import { interpolate } from "../../shared/util/template"
import { shorten } from "../../shared/util/string"
import { MAX_LABEL_LENGTH } from "./label"

/** Valid binary input pattern */
export const BINARY = /^[01]{0,8}\s?[01]{1,8}?$/
/** Valid numeric input pattern */
export const DATA = /^-?[0-9]+$/
/** Valid symbolic opcode pattern */
export const OPCODE = new RegExp(`(${opcodes.map(o => o.symbolic).join("|")})`)
export const JUST_OPCODE = new RegExp(`^${OPCODE.source}$`)
/** Valid immediate operand pattern */
export const IMMEDIATE_NUM = /#-?[0-9]{1,3}/
export const JUST_IMMEDIATE_NUM = new RegExp(`^${IMMEDIATE_NUM.source}$`)
/** Valid direct operand pattern */
export const DIRECT_PARAM = /[0-9]{1,3}/
export const JUST_DIRECT_PARAM = new RegExp(`^${DIRECT_PARAM.source}$`)
/** Valid label operand pattern */
export const LABEL_PARAM = /[A-Z_]{1,10}/
export const JUST_LABEL_PARAM = new RegExp(`^${LABEL_PARAM.source}$`)
/** Valid immediate label operand pattern */
export const IMMEDIATE_LABEL = /#[A-Z_]{1,10}/
export const JUST_IMMEDIATE_LABEL = new RegExp(`^${IMMEDIATE_LABEL.source}$`)
// prettier-ignore
/** Valid symbolic instruction pattern */
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

const EMPTY_SYMBOL_TABLE = new SymbolTable()

/**
 * Returns an instruction parsed from the input string
 * @param {string} input - The string containing the instruction to parse
 * @param {SymbolTable} symbolTable - A symbol table that may contain an eventual label referenced in the input string
 * @returns {Instruction}
 */
export function parseSymbolic(input: string, symbolTable: SymbolTable = EMPTY_SYMBOL_TABLE): Instruction {
	if (DATA.test(input)) {
		return _parseData(input)
	} else {
		return _parseSymbolic(input, symbolTable)
	}
}

/**
 * Returns an instruction parsed from the input string
 * @param {string} input - The string containing the instruction to parse as a binary string
 * @returns {Instruction}
 */
export function parseBinary(input: string): Instruction {
	if (BINARY.test(input)) {
		return _parseBinary(input)
	} else {
		throw new InstructionParsingError(text.get().errors.instruction_parsing.invalid_binary_input, input)
	}
}

/**
 * Parse an instruction in its symbolic form
 * @param {string} input - The string containing the instruction to parse
 * @param {SymbolTable} symbolTable - A symbol table that may contain an eventual label referenced in the input string
 * @returns {Instruction}
 */
function _parseSymbolic(input: string, symbolTable: SymbolTable): Instruction {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	if (!JUST_OPCODE.test(symbolicOpcode)) {
		throw new InstructionParsingError(
			interpolate(text.get().errors.instruction_parsing.invalid_opcode, shorten(symbolicOpcode, 10)),
			input
		)
	}
	const hasOperand = !!symbolicOperand
	const opcode = parseOpcode(symbolicOpcode)
	if (hasOperand) {
		if (!opcode.takesOperand) {
			throw new InstructionParsingError(
				interpolate(text.get().errors.instruction_parsing.operand_not_allowed, shorten(opcode.symbolic, 10)),
				input
			)
		}
		if (JUST_IMMEDIATE_LABEL.test(symbolicOperand)) {
			return _parseImmediateLabelOperand(input, opcode, symbolTable)
		} else if (JUST_LABEL_PARAM.test(symbolicOperand)) {
			return _parseDirectLabelOperand(input, opcode, symbolTable)
		} else if (JUST_IMMEDIATE_NUM.test(symbolicOperand)) {
			return _parseImmediateNumberOperand(input, opcode)
		} else if (JUST_DIRECT_PARAM.test(symbolicOperand)) {
			return _parseDirectOperand(input, opcode)
		} else {
			throw new InstructionParsingError(
				interpolate(text.get().errors.instruction_parsing.invalid_operand, shorten(symbolicOperand, 10)),
				input
			)
		}
	} else {
		if (opcode.takesOperand) {
			throw new InstructionParsingError(
				interpolate(text.get().errors.instruction_parsing.operand_required, shorten(opcode.symbolic, 10)),
				input
			)
		}
		return new Instruction(symbolicOpcode, "", BinaryValue.fromBytes([opcode.numeric, 0]))
	}
}

/**
 * Parse an instruction in its symbolic form that has a direct label as operand
 * @param {string} input - The string containing the instruction to parse
 * @param {Opcode} opcode - The opcode of the instruction
 * @param {SymbolTable} symbolTable - A symbol table that may contain an eventual label referenced in the input string
 * @returns {Instruction}
 */
function _parseDirectLabelOperand(input: string, opcode: Opcode, symbolTable: SymbolTable): Instruction {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	if (!symbolTable.hasLabel(symbolicOperand)) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.unknown_label,
				shorten(symbolicOperand, MAX_LABEL_LENGTH)
			),
			input
		)
	}
	const address = symbolTable.getAddress(symbolicOperand)
	return new Instruction(symbolicOpcode, symbolicOperand, BinaryValue.fromBytes([opcode.numeric, address]))
}

/**
 * Parse an instruction in its symbolic form that has an immediate number as operand
 * @param {string} input - The string containing the instruction to parse
 * @param {Opcode} opcode - The opcode of the instruction
 * @returns {Instruction}
 */
function _parseImmediateNumberOperand(input: string, opcode: Opcode): Instruction {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const numericOpcode = setImmediateFlag(new BinaryValue(8, opcode.numeric), true).signed()
	const numericOperand = parseInt(symbolicOperand.slice(1))
	if (!opcode.takesImmediate) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.immediate_operand_not_allowed,
				shorten(opcode.symbolic, 10)
			),
			input
		)
	}
	if (!isSigned(numericOperand, 8)) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.invalid_immediate_operand,
				shorten(numericOperand.toString(), 10)
			),
			input
		)
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytes([numericOpcode, numericOperand])
	)
}

/**
 * Parse an instruction in its symbolic form that has an immediate label as operand
 * @param {string} input - The string containing the instruction to parse
 * @param {Opcode} opcode - The opcode of the instruction
 * @param {SymbolTable} symbolTable - A symbol table that may contain an eventual label referenced in the input string
 * @returns {Instruction}
 */
function _parseImmediateLabelOperand(input: string, opcode: Opcode, symbolTable: SymbolTable): Instruction {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const label = symbolicOperand.slice(1)
	if (!symbolTable.hasLabel(label)) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.unknown_label,
				shorten(symbolicOperand, MAX_LABEL_LENGTH)
			),
			input
		)
	}
	const numericOpcode = setImmediateFlag(new BinaryValue(8, opcode.numeric), true).signed()
	const numericOperand = symbolTable.getAddress(label)
	if (!opcode.takesImmediate) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.immediate_operand_not_allowed,
				shorten(opcode.symbolic, 10)
			),
			input
		)
	}
	if (!isSigned(numericOperand, 8)) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.invalid_immediate_operand,
				shorten(numericOperand.toString(), 10)
			),
			input
		)
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytes([numericOpcode, numericOperand])
	)
}

/**
 * Parse an instruction in its symbolic form that has a ram address as operand
 * @param {string} input - The string containing the instruction to parse
 * @param {Opcode} opcode - The opcode of the instruction
 * @returns {Instruction}
 */
function _parseDirectOperand(input: string, opcode: Opcode): Instruction {
	const [symbolicOpcode, symbolicOperand] = input.split(" ")
	const numericOperand = parseInt(symbolicOperand)
	if (!isValidAddress(numericOperand)) {
		throw new InstructionParsingError(
			interpolate(
				text.get().errors.instruction_parsing.invalid_direct_operand,
				shorten(numericOperand.toString(), 10)
			),
			input
		)
	}
	return new Instruction(
		symbolicOpcode,
		symbolicOperand,
		BinaryValue.fromBytes([opcode.numeric, numericOperand])
	)
}

/**
 * Parse an instruction in its binary form
 * @param {string} input - The string containing the instruction to parse in its binary form
 * @returns {Instruction}
 */
function _parseBinary(input: string): Instruction {
	if (input.includes(" ")) {
		const [opc, opr] = input.split(" ")
		input = opc + pad(opr, 8)
	}
	const value = new BinaryValue(16, input)
	const opcodeValue = value.getByte(1)
	const operandValue = value.getByte(2)
	const immediateFlagSet = isImmediateFlagSet(opcodeValue)
	const opcode = parseOpcode(removeFlags(opcodeValue))
	const invalidate =
		!opcode ||
		(!opcode.takesOperand && operandValue.unsigned() !== 0) ||
		(immediateFlagSet && !opcode.takesImmediate) ||
		(!immediateFlagSet && !isValidAddress(operandValue.unsigned()))
	const symbolicOpcode = invalidate ? value.signed().toString() : opcode.symbolic
	let symbolicOperand = immediateFlagSet ? "#" + operandValue.signed() : operandValue.unsigned().toString()
	if (invalidate || !opcode.takesOperand) {
		symbolicOperand = ""
	}
	return new Instruction(symbolicOpcode, symbolicOperand, value, invalidate)
}

/**
 * Parse an instruction represented as a number
 * @param {string} input - The string containing the instruction to parse
 * @returns {Instruction}
 */
function _parseData(input: string): Instruction {
	const numericValue = parseInt(input)
	if (!isSigned(numericValue, 16)) {
		throw new InstructionParsingError(
			interpolate(text.get().errors.instruction_parsing.invalid_data, shorten(numericValue.toString(), 10)),
			input
		)
	}
	const value = new BinaryValue(16, numericValue)
	const opcodeValue = value.getByte(1)
	const operandValue = value.getByte(2)
	const opcode = parseOpcode(removeFlags(opcodeValue))
	const immediateFlagSet = isImmediateFlagSet(opcodeValue)
	const invalidate =
		!opcode ||
		(!opcode.takesOperand && operandValue.signed() !== 0) ||
		(!opcode.takesImmediate && immediateFlagSet) ||
		(!opcode.takesOperand && immediateFlagSet)
	return new Instruction(input, "", value, invalidate)
}
