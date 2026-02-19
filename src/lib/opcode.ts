import type { SizedInt } from "./integer"

/** Immediate flag bit set to 1, all other bits set to 0 */
export const IMMEDIATE_FLAG_BIT = 1 << 7
/** Immediate flag bit set to 0, all other bits set to 1 */
export const IMMEDIATE_FLAG_MASK = ~IMMEDIATE_FLAG_BIT >>> 0

/** Return wether or not the immediate flag is set. The input value is assumed to be an 8-bit integer */
export function getImmediateFlag(value: SizedInt<8>): boolean {
	return (value & IMMEDIATE_FLAG_BIT) !== 0
}

/** Return the provided value with the immediate flag set/unset.
 * The input value is assumed to be an 8-bit integer */
export function setImmediateFlag(value: SizedInt<8>, flag: boolean = true): SizedInt<8> {
	if (flag) {
		return (value | IMMEDIATE_FLAG_BIT) as SizedInt<8>
	}
	return (value & IMMEDIATE_FLAG_MASK) as SizedInt<8>
}

export const OPCODE_NUMBER_NOP = 0
export const OPCODE_NUMBER_HLT = 1
export const OPCODE_NUMBER_JMP = 2
export const OPCODE_NUMBER_JZ = 3
export const OPCODE_NUMBER_JNZ = 4
export const OPCODE_NUMBER_JN = 5
export const OPCODE_NUMBER_JNN = 6
export const OPCODE_NUMBER_LOD = 7
export const OPCODE_NUMBER_STO = 8
export const OPCODE_NUMBER_ADD = 9
export const OPCODE_NUMBER_SUB = 10
export const OPCODE_NUMBER_MUL = 11
export const OPCODE_NUMBER_DIV = 12
export const OPCODE_NUMBER_AND = 13
export const OPCODE_NUMBER_CMP = 14
export const OPCODE_NUMBER_NOT = 15

/** The numeric representation of an opcode (without the immediate flag). */
export type OpcodeNumber =
	| typeof OPCODE_NUMBER_NOP
	| typeof OPCODE_NUMBER_HLT
	| typeof OPCODE_NUMBER_JMP
	| typeof OPCODE_NUMBER_JZ
	| typeof OPCODE_NUMBER_JNZ
	| typeof OPCODE_NUMBER_JN
	| typeof OPCODE_NUMBER_JNN
	| typeof OPCODE_NUMBER_LOD
	| typeof OPCODE_NUMBER_STO
	| typeof OPCODE_NUMBER_ADD
	| typeof OPCODE_NUMBER_SUB
	| typeof OPCODE_NUMBER_MUL
	| typeof OPCODE_NUMBER_DIV
	| typeof OPCODE_NUMBER_AND
	| typeof OPCODE_NUMBER_CMP
	| typeof OPCODE_NUMBER_NOT

export const OPCODE_STRING_NOP = "NOP"
export const OPCODE_STRING_HLT = "HLT"
export const OPCODE_STRING_JMP = "JMP"
export const OPCODE_STRING_JZ = "JZ"
export const OPCODE_STRING_JNZ = "JNZ"
export const OPCODE_STRING_JN = "JN"
export const OPCODE_STRING_JNN = "JNN"
export const OPCODE_STRING_LOD = "LOD"
export const OPCODE_STRING_STO = "STO"
export const OPCODE_STRING_ADD = "ADD"
export const OPCODE_STRING_SUB = "SUB"
export const OPCODE_STRING_MUL = "MUL"
export const OPCODE_STRING_DIV = "DIV"
export const OPCODE_STRING_AND = "AND"
export const OPCODE_STRING_CMP = "CMP"
export const OPCODE_STRING_NOT = "NOT"

/** The symbolic representation of an opcode. */
export type OpcodeString =
	| typeof OPCODE_STRING_NOP
	| typeof OPCODE_STRING_HLT
	| typeof OPCODE_STRING_JMP
	| typeof OPCODE_STRING_JZ
	| typeof OPCODE_STRING_JNZ
	| typeof OPCODE_STRING_JN
	| typeof OPCODE_STRING_JNN
	| typeof OPCODE_STRING_LOD
	| typeof OPCODE_STRING_STO
	| typeof OPCODE_STRING_ADD
	| typeof OPCODE_STRING_SUB
	| typeof OPCODE_STRING_MUL
	| typeof OPCODE_STRING_DIV
	| typeof OPCODE_STRING_AND
	| typeof OPCODE_STRING_CMP
	| typeof OPCODE_STRING_NOT

export const OPCODE_NOP = {
	symbolic: OPCODE_STRING_NOP,
	numeric: OPCODE_NUMBER_NOP,
	takesOperand: false,
	takesImmediate: false,
} as const
export const OPCODE_HLT = {
	symbolic: OPCODE_STRING_HLT,
	numeric: OPCODE_NUMBER_HLT,
	takesOperand: false,
	takesImmediate: false,
} as const
export const OPCODE_JMP = {
	symbolic: OPCODE_STRING_JMP,
	numeric: OPCODE_NUMBER_JMP,
	takesOperand: true,
	takesImmediate: false,
} as const
export const OPCODE_JZ = {
	symbolic: OPCODE_STRING_JZ,
	numeric: OPCODE_NUMBER_JZ,
	takesOperand: true,
	takesImmediate: false,
} as const
export const OPCODE_JNZ = {
	symbolic: OPCODE_STRING_JNZ,
	numeric: OPCODE_NUMBER_JNZ,
	takesOperand: true,
	takesImmediate: false,
} as const
export const OPCODE_JN = {
	symbolic: OPCODE_STRING_JN,
	numeric: OPCODE_NUMBER_JN,
	takesOperand: true,
	takesImmediate: false,
} as const
export const OPCODE_JNN = {
	symbolic: OPCODE_STRING_JNN,
	numeric: OPCODE_NUMBER_JNN,
	takesOperand: true,
	takesImmediate: false,
} as const
export const OPCODE_LOD = {
	symbolic: OPCODE_STRING_LOD,
	numeric: OPCODE_NUMBER_LOD,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "=",
} as const
export const OPCODE_STO = {
	symbolic: OPCODE_STRING_STO,
	numeric: OPCODE_NUMBER_STO,
	takesOperand: true,
	takesImmediate: false,
} as const
export const OPCODE_ADD = {
	symbolic: OPCODE_STRING_ADD,
	numeric: OPCODE_NUMBER_ADD,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "+",
} as const
export const OPCODE_SUB = {
	symbolic: OPCODE_STRING_SUB,
	numeric: OPCODE_NUMBER_SUB,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "-",
} as const
export const OPCODE_MUL = {
	symbolic: OPCODE_STRING_MUL,
	numeric: OPCODE_NUMBER_MUL,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "*",
} as const
export const OPCODE_DIV = {
	symbolic: OPCODE_STRING_DIV,
	numeric: OPCODE_NUMBER_DIV,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "/",
} as const
export const OPCODE_AND = {
	symbolic: OPCODE_STRING_AND,
	numeric: OPCODE_NUMBER_AND,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: "&",
} as const
export const OPCODE_CMP = {
	symbolic: OPCODE_STRING_CMP,
	numeric: OPCODE_NUMBER_CMP,
	takesOperand: true,
	takesImmediate: true,
	aluSymbol: ":",
} as const
export const OPCODE_NOT = {
	symbolic: OPCODE_STRING_NOT,
	numeric: OPCODE_NUMBER_NOT,
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

/** All the opcodes. */
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

/** All opcodes mapped to their symbolic representation. */
export const OPCODES_BY_STRING = {
	[OPCODE_STRING_NOP]: OPCODE_NOP,
	[OPCODE_STRING_HLT]: OPCODE_HLT,
	[OPCODE_STRING_JMP]: OPCODE_JMP,
	[OPCODE_STRING_JZ]: OPCODE_JZ,
	[OPCODE_STRING_JNZ]: OPCODE_JNZ,
	[OPCODE_STRING_JN]: OPCODE_JN,
	[OPCODE_STRING_JNN]: OPCODE_JNN,
	[OPCODE_STRING_LOD]: OPCODE_LOD,
	[OPCODE_STRING_STO]: OPCODE_STO,
	[OPCODE_STRING_ADD]: OPCODE_ADD,
	[OPCODE_STRING_SUB]: OPCODE_SUB,
	[OPCODE_STRING_MUL]: OPCODE_MUL,
	[OPCODE_STRING_DIV]: OPCODE_DIV,
	[OPCODE_STRING_AND]: OPCODE_AND,
	[OPCODE_STRING_CMP]: OPCODE_CMP,
	[OPCODE_STRING_NOT]: OPCODE_NOT,
} as const

/** All possible numeric values of a valid opcode.
 * Variations where the immediate flag is set are included for opcodes that allow for it. */
export const OPCODES_BY_NUMBER = OPCODES.reduce<{ [key: number]: Opcode }>(
	(accumulator, opcode) => {
		if (opcode.takesImmediate) {
			const numericWithImmediate = setImmediateFlag(opcode.numeric as SizedInt<8>, true)
			accumulator[numericWithImmediate] = opcode
		}
		accumulator[opcode.numeric] = opcode
		return accumulator
	},
	{},
)
