import BinaryValue from "../util/BinaryValue"

export type Opcode = typeof opcodes[number]
export type SymbolicOpcode = typeof opcodes[number]["symbolic"]
export type NumericOpcode = typeof opcodes[number]["numeric"]
export type Operators = typeof opcodes[number]["operator"]
export const IMMEDIATE_FLAG_POS = 1 // the most significant bit

export const opcodes = [
	// CONTROL FLOW
	{
		symbolic: "NOP",
		numeric: 0,
		takesOperand: false,
		takesImmediate: false,
		operator: ""
	},
	{
		symbolic: "HLT",
		numeric: 1,
		takesOperand: false,
		takesImmediate: false,
		operator: ""
	},
	{
		symbolic: "JMP",
		numeric: 2,
		takesOperand: true,
		takesImmediate: false,
		operator: ""
	},
	{
		symbolic: "JZ",
		numeric: 3,
		takesOperand: true,
		takesImmediate: false,
		operator: ""
	},
	{
		symbolic: "JNZ",
		numeric: 4,
		takesOperand: true,
		takesImmediate: false,
		operator: ""
	},
	{
		symbolic: "JN",
		numeric: 5,
		takesOperand: true,
		takesImmediate: false,
		operator: ""
	},
	{
		symbolic: "JNN",
		numeric: 6,
		takesOperand: true,
		takesImmediate: false,
		operator: ""
	},

	// DATA FLOW
	{
		symbolic: "LOD",
		numeric: 7,
		takesOperand: true,
		takesImmediate: true,
		operator: "="
	},
	{
		symbolic: "STO",
		numeric: 8,
		takesOperand: true,
		takesImmediate: false,
		operator: ""
	},

	// ARITHMETIC-LOGIC
	{
		symbolic: "ADD",
		numeric: 9,
		takesOperand: true,
		takesImmediate: true,
		operator: "+"
	},
	{
		symbolic: "SUB",
		numeric: 10,
		takesOperand: true,
		takesImmediate: true,
		operator: "-"
	},
	{
		symbolic: "MUL",
		numeric: 11,
		takesOperand: true,
		takesImmediate: true,
		operator: "*"
	},
	{
		symbolic: "DIV",
		numeric: 12,
		takesOperand: true,
		takesImmediate: true,
		operator: "/"
	},
	{
		symbolic: "AND",
		numeric: 13,
		takesOperand: true,
		takesImmediate: true,
		operator: "&"
	},
	{
		symbolic: "CMP",
		numeric: 14,
		takesOperand: true,
		takesImmediate: true,
		operator: ":"
	},
	{
		symbolic: "NOT",
		numeric: 15,
		takesOperand: true,
		takesImmediate: true,
		operator: "!"
	}
] as const

export function opcode(param: string | BinaryValue): Opcode {
	return typeof param === "string"
		? opcodes.find(opcode => opcode.symbolic === param)
		: opcodes.find(opcode => opcode.numeric === param.getByte(1).unsigned())
}
