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
		operator: "",
		category: "CONTROL_FLOW"
	},
	{
		symbolic: "HLT",
		numeric: 1,
		takesOperand: false,
		takesImmediate: false,
		operator: "",
		category: "CONTROL_FLOW"
	},
	{
		symbolic: "JMP",
		numeric: 2,
		takesOperand: true,
		takesImmediate: false,
		operator: "",
		category: "CONTROL_FLOW"
	},
	{
		symbolic: "JZ",
		numeric: 3,
		takesOperand: true,
		takesImmediate: false,
		operator: "",
		category: "CONTROL_FLOW"
	},
	{
		symbolic: "JNZ",
		numeric: 4,
		takesOperand: true,
		takesImmediate: false,
		operator: "",
		category: "CONTROL_FLOW"
	},
	{
		symbolic: "JN",
		numeric: 5,
		takesOperand: true,
		takesImmediate: false,
		operator: "",
		category: "CONTROL_FLOW"
	},
	{
		symbolic: "JNN",
		numeric: 6,
		takesOperand: true,
		takesImmediate: false,
		operator: "",
		category: "CONTROL_FLOW"
	},

	// DATA FLOW
	{
		symbolic: "LOD",
		numeric: 7,
		takesOperand: true,
		takesImmediate: true,
		operator: "=",
		category: "DATA_FLOW"
	},
	{
		symbolic: "STO",
		numeric: 8,
		takesOperand: true,
		takesImmediate: false,
		operator: "",
		category: "DATA_FLOW"
	},

	// ARITHMETIC-LOGIC
	{
		symbolic: "ADD",
		numeric: 9,
		takesOperand: true,
		takesImmediate: true,
		operator: "+",
		category: "ARITHMETIC_LOGIC"
	},
	{
		symbolic: "SUB",
		numeric: 10,
		takesOperand: true,
		takesImmediate: true,
		operator: "-",
		category: "ARITHMETIC_LOGIC"
	},
	{
		symbolic: "MUL",
		numeric: 11,
		takesOperand: true,
		takesImmediate: true,
		operator: "*",
		category: "ARITHMETIC_LOGIC"
	},
	{
		symbolic: "DIV",
		numeric: 12,
		takesOperand: true,
		takesImmediate: true,
		operator: "/",
		category: "ARITHMETIC_LOGIC"
	},
	{
		symbolic: "AND",
		numeric: 13,
		takesOperand: true,
		takesImmediate: true,
		operator: "&",
		category: "ARITHMETIC_LOGIC"
	},
	{
		symbolic: "CMP",
		numeric: 14,
		takesOperand: true,
		takesImmediate: true,
		operator: ":",
		category: "ARITHMETIC_LOGIC"
	},
	{
		symbolic: "NOT",
		numeric: 15,
		takesOperand: true,
		takesImmediate: true,
		operator: "!",
		category: "ARITHMETIC_LOGIC"
	}
] as const

export function opcode(param: string | BinaryValue): Opcode {
	return typeof param === "string"
		? opcodes.find(opcode => opcode.symbolic === param)
		: opcodes.find(opcode => opcode.numeric === param.getByte(1).unsigned())
}
