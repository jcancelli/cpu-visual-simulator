import Instruction from "../../instruction/Instruction"
import Action from "./Action"
import FlashCpu from "./animations/FlashCpu"
import FlashRam from "./animations/FlashRam"
import FlashWire from "./animations/FlashWire"
import StoreCpuState from "./state/StoreCpuState"
import CompareUpdateSW from "./cpu/CompareUpdateSW"
import ExecuteAluOperation from "./cpu/ExecuteAluOperation"
import UpdateSW from "./cpu/UpdateSW"
import StoreAccToAddress from "./ram/StoreAccToAddress"
import HaltExecution from "./cpu/HaltExecution"
import {
	DECODE_OPCODE,
	SET_MUX,
	SET_ALU_OPERATION,
	LOAD_ALU1_FROM_ACC,
	LOAD_ALU2,
	SET_PC_TO_IR_OPERAND,
	SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG,
	SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG,
	SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG,
	SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG
} from "./actionMacros"

export function instructionToActions(instruction: Instruction): Action[] {
	if (!instruction.opcode) {
		throw new Error("Invalid opcode")
	}
	const actions: Action[] = []
	switch (instruction.opcode.symbolic) {
		case "ADD":
		case "SUB":
		case "MUL":
		case "DIV":
		case "AND":
		case "NOT":
			actions.push(
				...DECODE_OPCODE,
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU1_FROM_ACC,
				...LOAD_ALU2(instruction.immediateFlag()),
				new FlashWire("ALU:4", "ACC:2"),
				new ExecuteAluOperation().endstep(),
				new FlashWire("ALU:3", "SW:1"),
				new UpdateSW().endstep()
			)
			break

		case "NOT":
			actions.push(
				...DECODE_OPCODE,
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU2(instruction.immediateFlag()),
				new FlashWire("ALU:4", "ACC:2"),
				new ExecuteAluOperation().endstep(),
				new FlashWire("ALU:3", "SW:1"),
				new UpdateSW().endstep()
			)
			break

		case "CMP":
			actions.push(
				...DECODE_OPCODE,
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU1_FROM_ACC,
				...LOAD_ALU2(instruction.immediateFlag()),
				new FlashWire("ALU:3", "SW:1"),
				new CompareUpdateSW().endstep()
			)
			break

		case "LOD":
			actions.push(
				...DECODE_OPCODE,
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU2(instruction.immediateFlag()),
				new FlashWire("ALU:4", "ACC:2"),
				new ExecuteAluOperation().endstep()
			)
			break

		case "STO":
			actions.push(
				...DECODE_OPCODE,
				new FlashWire("IR:2", "RAM:ADD"),
				new FlashRam("ADDRESS", "IR:OPR").endstep(),
				new StoreCpuState("ACC").sideffects(new FlashCpu("ACC")),
				new FlashWire("ACC:1", "RAM:DATA").endstep(),
				new FlashWire("CU:3", "RAM:CTRL").endstep(),
				new StoreAccToAddress("IR:OPR").endstep()
			)
			break

		case "JMP":
			actions.push(...DECODE_OPCODE, ...SET_PC_TO_IR_OPERAND)
			break

		case "JZ":
			actions.push(...DECODE_OPCODE, new FlashCpu("SW:Z"), ...SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG)
			break

		case "JNZ":
			actions.push(...DECODE_OPCODE, new FlashCpu("SW:Z"), ...SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG)
			break

		case "JN":
			actions.push(...DECODE_OPCODE, new FlashCpu("SW:N"), ...SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG)
			break

		case "JNN":
			actions.push(
				...DECODE_OPCODE,
				new FlashCpu("SW:N"),
				...SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG
			)
			break

		case "NOP":
			actions.push(...DECODE_OPCODE)
			break

		case "HLT":
			actions.push(...DECODE_OPCODE, new HaltExecution().endstep())
			break

		default:
			throw new Error(`Unrecognized opcode: "${instruction.opcode["symbolic"]}"`)
	}
	return actions
}
