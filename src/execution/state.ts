import { get } from "svelte/store"
import Instruction from "../instruction/Instruction"
import { Operators } from "../instruction/Opcode"
import cpu from "../store/cpu"

export type Key = keyof State
export type State = {
	IR: Instruction | null
	"IR:OPC": number | null
	"IR:OPR": number | null
	PC: number | null
	INC: number | null
	"ALU:1": number | null
	"ALU:2": number | null
	"ALU:OPR": Operators
	ACC: number | null
	"SW:Z": boolean
	"SW:N": boolean
	RAM: {
		address: number
		data: Instruction
	} | null
}

export const state: State = {
	IR: get(cpu).instructionRegister,
	"IR:OPC": get(cpu).instructionRegister?.numericOpcode(),
	"IR:OPR": get(cpu).instructionRegister?.numericOperand(),
	PC: get(cpu).programCounter.unsigned(),
	INC: get(cpu).increment.unsigned(),
	"ALU:1": get(cpu).alu1?.signed(),
	"ALU:2": get(cpu).alu2?.signed(),
	"ALU:OPR": get(cpu).operation,
	ACC: get(cpu).accumulator.signed(),
	"SW:Z": get(cpu).zeroFlag,
	"SW:N": get(cpu).negativeFlag,
	RAM: null
}

export default state
