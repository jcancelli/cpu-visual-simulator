import {
	ImmediateFlagNotAllowedError,
	InvalidNumericOpcodeError,
	InvalidSymbolicOpcodeError,
	OperandNotAllowedError,
	OperandRequiredError,
} from "$lib/errors/opcode"
import type { Byte, U8 } from "./integer"

/** Immediate flag bit set to 1, all other bits set to 0 */
export const IMMEDIATE_FLAG_BIT = 1 << 7
/** Immediate flag bit set to 0, all other bits set to 1 */
export const IMMEDIATE_FLAG_MASK = ~IMMEDIATE_FLAG_BIT >>> 0

/** The input is assumed to be a valid 8-bit integer, no validation is performed.
 * @returns The state of the immediate flag bit for the provided value value */
export function getImmediateFlag<T extends Byte>(value: T): boolean {
	return (value & IMMEDIATE_FLAG_BIT) !== 0
}

/** The input is assumed to be a valid 8-bit integer, no validation is performed.
 * @returns The provided value with the immediate flag bit set to either 1 or 0 */
export function setImmediateFlag<T extends Byte>(value: T, flag: boolean = true): T {
	if (flag) {
		return (value | IMMEDIATE_FLAG_BIT) as T
	}
	return (value & IMMEDIATE_FLAG_MASK) as T
}

/** The input is assumed to be a valid 8-bit integer, no validation is performed.
 * @returns The provided value with the immediate flag bit set to 0 */
export function withoutImmediateFlag<T extends Byte>(value: T): T {
	return setImmediateFlag(value, false)
}

/** The input is assumed to be a valid 8-bit integer, no validation is performed.
 * @returns The provided value with the immediate flag bit set to 1 */
export function withImmediateFlag<T extends Byte>(value: T): T {
	return setImmediateFlag(value, true)
}

/** The numeric representation of an opcode with the immediate flag bit set to 0 */
export enum OpcodeNumeric {
	NOP = 0,
	HLT = 1,
	JMP = 2,
	JZ = 3,
	JNZ = 4,
	JN = 5,
	JNN = 6,
	LOD = 7,
	STO = 8,
	ADD = 9,
	SUB = 10,
	MUL = 11,
	DIV = 12,
	AND = 13,
	CMP = 14,
	NOT = 15,
}

/** The symbolic representation of an opcode */
export enum OpcodeSymbolic {
	NOP = "NOP",
	HLT = "HLT",
	JMP = "JMP",
	JZ = "JZ",
	JNZ = "JNZ",
	JN = "JN",
	JNN = "JNN",
	LOD = "LOD",
	STO = "STO",
	ADD = "ADD",
	SUB = "SUB",
	MUL = "MUL",
	DIV = "DIV",
	AND = "AND",
	CMP = "CMP",
	NOT = "NOT",
}

/** No-operation */
export const OPCODE_NOP = {
	symbolic: OpcodeSymbolic.NOP,
	numeric: OpcodeNumeric.NOP,
	takesOperand: false,
	takesImmediate: false,
} as const
/** Halt execution */
export const OPCODE_HLT = {
	symbolic: OpcodeSymbolic.HLT,
	numeric: OpcodeNumeric.HLT,
	takesOperand: false,
	takesImmediate: false,
} as const
/** Unconditional jump */
export const OPCODE_JMP = {
	symbolic: OpcodeSymbolic.JMP,
	numeric: OpcodeNumeric.JMP,
	takesOperand: true,
	takesImmediate: false,
} as const
/** Jump if zero flag is 1 */
export const OPCODE_JZ = {
	symbolic: OpcodeSymbolic.JZ,
	numeric: OpcodeNumeric.JZ,
	takesOperand: true,
	takesImmediate: false,
} as const
/** Jump if zero flag is 0 */
export const OPCODE_JNZ = {
	symbolic: OpcodeSymbolic.JNZ,
	numeric: OpcodeNumeric.JNZ,
	takesOperand: true,
	takesImmediate: false,
} as const
/** Jump if negative flag is 1 */
export const OPCODE_JN = {
	symbolic: OpcodeSymbolic.JN,
	numeric: OpcodeNumeric.JN,
	takesOperand: true,
	takesImmediate: false,
} as const
/** Jump if negative flag is 0 */
export const OPCODE_JNN = {
	symbolic: OpcodeSymbolic.JNN,
	numeric: OpcodeNumeric.JNN,
	takesOperand: true,
	takesImmediate: false,
} as const
/** Load value into accumulator */
export const OPCODE_LOD = {
	symbolic: OpcodeSymbolic.LOD,
	numeric: OpcodeNumeric.LOD,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "=",
} as const
/** Store value of the accumulator into memory */
export const OPCODE_STO = {
	symbolic: OpcodeSymbolic.STO,
	numeric: OpcodeNumeric.STO,
	takesOperand: true,
	takesImmediate: false,
} as const
/** Addition */
export const OPCODE_ADD = {
	symbolic: OpcodeSymbolic.ADD,
	numeric: OpcodeNumeric.ADD,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "+",
} as const
/** Subtraction */
export const OPCODE_SUB = {
	symbolic: OpcodeSymbolic.SUB,
	numeric: OpcodeNumeric.SUB,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "-",
} as const
/** Multiplication */
export const OPCODE_MUL = {
	symbolic: OpcodeSymbolic.MUL,
	numeric: OpcodeNumeric.MUL,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "*",
} as const
/** Division */
export const OPCODE_DIV = {
	symbolic: OpcodeSymbolic.DIV,
	numeric: OpcodeNumeric.DIV,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "/",
} as const
/** Bitwise AND */
export const OPCODE_AND = {
	symbolic: OpcodeSymbolic.AND,
	numeric: OpcodeNumeric.AND,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "&",
} as const
/** Compare operands and update status word:
 * - first==second: zero flag = 1 and negative flag = 0
 * - first<second: zero flag = 0 and negative flag = 1
 * - first>second: zero flag = 0 and negative flag = 0 */
export const OPCODE_CMP = {
	symbolic: OpcodeSymbolic.CMP,
	numeric: OpcodeNumeric.CMP,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: ":",
} as const
/** Bitwise NOT */
export const OPCODE_NOT = {
	symbolic: OpcodeSymbolic.NOT,
	numeric: OpcodeNumeric.NOT,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "!",
} as const

export type Opcode =
	| typeof OPCODE_NOP
	| typeof OPCODE_HLT
	| typeof OPCODE_JMP
	| typeof OPCODE_JZ
	| typeof OPCODE_JNZ
	| typeof OPCODE_JN
	| typeof OPCODE_JNN
	| typeof OPCODE_LOD
	| typeof OPCODE_STO
	| typeof OPCODE_ADD
	| typeof OPCODE_SUB
	| typeof OPCODE_MUL
	| typeof OPCODE_DIV
	| typeof OPCODE_AND
	| typeof OPCODE_CMP
	| typeof OPCODE_NOT

/** Opcode for the specified numeric value */
export type OpcodeForNumeric<T extends OpcodeNumeric> = Extract<Opcode, { numeric: T }>

/** Opcode for the specified symbolic value */
export type OpcodeForSymbolic<T extends OpcodeSymbolic> = Extract<Opcode, { symbolic: T }>

/** All the opcodes */
export const OPCODES = [
	OPCODE_NOP,
	OPCODE_HLT,
	OPCODE_JMP,
	OPCODE_JZ,
	OPCODE_JNZ,
	OPCODE_JN,
	OPCODE_JNN,
	OPCODE_LOD,
	OPCODE_STO,
	OPCODE_ADD,
	OPCODE_SUB,
	OPCODE_MUL,
	OPCODE_DIV,
	OPCODE_AND,
	OPCODE_CMP,
	OPCODE_NOT,
] as const

/** All opcodes mapped to their symbolic representation */
const OPCODES_BY_SYMBOLIC = OPCODES.reduce(
	(map, opcode) => {
		map[opcode.symbolic] = opcode
		return map
	},
	{} as Record<string, Opcode>,
) as Readonly<Record<string, Opcode>>

/** @returns The {@link Opcode} matching the provided string or undefined */
export function getOpcodeBySymbolic(value: string): Opcode | undefined {
	return OPCODES_BY_SYMBOLIC[value]
}

/** @returns The {@link Opcode} matching the provided string.
 * @throws {InvalidSymbolicOpcodeError} */
export function getOpcodeBySymbolicOrThrow(value: string): Opcode {
	const opcode = OPCODES_BY_SYMBOLIC[value]
	if (opcode === undefined) {
		throw new InvalidSymbolicOpcodeError(value)
	}
	return opcode
}

/** Check if the provided string is a valid {@link OpcodeSymbolic} */
export function isOpcodeSymbolic(value: string): value is OpcodeSymbolic {
	return OPCODES_BY_SYMBOLIC[value] !== undefined
}

/** Assert that the provided string is a valid {@link OpcodeSymbolic}.
 * @throws {InvalidSymbolicOpcodeError} */
export function assertOpcodeSymbolic(value: string): asserts value is OpcodeSymbolic {
	if (!isOpcodeSymbolic(value)) {
		throw new InvalidSymbolicOpcodeError(value)
	}
}

/** All opcodes indexed by their numeric representation */
const OPCODES_BY_NUMERIC_NO_IMMEDIATE = OPCODES.reduce(
	(map, opcode) => {
		map[opcode.numeric] = opcode
		return map
	},
	{} as Record<number, Opcode>,
) as Readonly<Record<number, Opcode>>

/** All opcodes that take an immediate operand indexed by their numeric representation with the immediate flag set */
const OPCODES_BY_NUMERIC_WITH_IMMEDIATE = OPCODES.reduce(
	(map, opcode) => {
		if (opcode.takesImmediate) {
			map[withImmediateFlag(opcode.numeric as Byte)] = opcode
		}
		return map
	},
	{} as Record<number, Opcode>,
) as Readonly<Record<number, Opcode>>

/** All possible numeric values of a valid opcode.
 * Variations where the immediate flag is set are included for opcodes that allow for it. */
const OPCODES_BY_NUMERIC = {
	...OPCODES_BY_NUMERIC_NO_IMMEDIATE,
	...OPCODES_BY_NUMERIC_WITH_IMMEDIATE,
} as const

/** @returns The {@link Opcode} matching the provided number or undefined.
 * Variations with the immediate flag set are also matched. */
export function getOpcodeByNumeric(value: number): Opcode | undefined {
	return OPCODES_BY_NUMERIC[value]
}

/** @returns The {@link Opcode} matching the provided number.
 * Variations with the immediate flag set are also matched.
 * @throws {InvalidNumericOpcodeError} */
export function getOpcodeByNumericOrThrow(value: number): Opcode {
	const opcode = OPCODES_BY_NUMERIC[value]
	if (opcode === undefined) {
		throw new InvalidNumericOpcodeError(value)
	}
	return opcode
}

/** Check if the provided number is a valid {@link OpcodeNumeric}.
 * Values with the immediate flag set evaluate to false even if their opcode allows for it. */
export function isOpcodeNumeric(opcode: number): opcode is OpcodeNumeric {
	return OPCODES_BY_NUMERIC_NO_IMMEDIATE[opcode] !== undefined
}

/** Assert that the provided number is a valid {@link OpcodeNumeric}.
 * Values with the immediate flag set are considered invalid even if their opcode allows for it.
 * @throws {InvalidNumericOpcodeError} */
export function assertOpcodeNumeric(opcode: number): asserts opcode is OpcodeNumeric {
	if (!isOpcodeNumeric(opcode)) {
		throw new InvalidNumericOpcodeError(opcode)
	}
}

/** Opcode that takes an operand */
export type OpcodeWithOperand = Exclude<Opcode, { takesOperand: false }>

/** Check if an opcode takes an operand */
export function opcodeTakesOperand(opcode: Opcode): opcode is OpcodeWithOperand {
	return opcode.takesOperand
}

/** Assert that an opcode takes operands.
 * @throws {OperandNotAllowedError} */
export function assertOpcodeTakesOperand(opcode: Opcode): asserts opcode is OpcodeWithOperand {
	if (opcodeDoesNotTakeOperand(opcode)) {
		throw new OperandNotAllowedError(opcode)
	}
}

/** Opcode that does not take an operand */
export type OpcodeWithoutOperand = Exclude<Opcode, { takesOperand: true }>

/** Check if an opcode does not take an operand */
export function opcodeDoesNotTakeOperand(opcode: Opcode): opcode is OpcodeWithoutOperand {
	return !opcode.takesOperand
}

/** Assert that an opcode does not take an operand.
 * @throws {OperandRequiredError} */
export function assertOpcodeDoesNotTakeOperand(
	opcode: Opcode,
): asserts opcode is OpcodeWithoutOperand {
	if (opcodeTakesOperand(opcode)) {
		throw new OperandRequiredError(opcode)
	}
}

/** Opcode that takes the immediate flag */
export type OpcodeWithImmediate = Exclude<Opcode, { takesImmediate: false }>

/** Check that an opcode allows immediate operands */
export function opcodeAllowsImmediateOperand(opcode: Opcode): opcode is OpcodeWithImmediate {
	return opcode.takesImmediate
}

/** Assert that an opcode allows immediate operands.
 * @throws {ImmediateFlagNotAllowedError} */
export function assertOpcodeAllowsImmediateOperand(
	opcode: Opcode,
): asserts opcode is OpcodeWithImmediate {
	if (opcodeDoesNotAllowImmediateOperand(opcode)) {
		throw new ImmediateFlagNotAllowedError(opcode)
	}
}

/** Opcode that does not take the immediate flag */
export type OpcodeWithoutImmediate = Exclude<Opcode, { takesImmediate: true }>

/** Check that an opcode does not allow immediate operands */
export function opcodeDoesNotAllowImmediateOperand(
	opcode: Opcode,
): opcode is OpcodeWithoutImmediate {
	return !opcode.takesImmediate
}

/** Encode an opcode and an immediate flag into its numeric representation. No validation is performed. */
export function encodeOpcode(opcode: Opcode = OPCODE_NOP, immediateFlag: boolean = false): U8 {
	return setImmediateFlag(opcode.numeric as U8, immediateFlag)
}
