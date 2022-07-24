import Instruction from "../../instruction/Instruction"
import Action from "./Action"
import FlashCpu from "./animations/FlashCpu"
import FlashRam from "./animations/FlashRam"
import FlashWire from "./animations/FlashWire"
import CompareUpdateSW from "./cpu/CompareUpdateSW"
import ExecuteAluOperation from "./cpu/ExecuteAluOperation"
import UpdateSW from "./cpu/UpdateSW"
import MemoryWrite from "./ram/MemoryWrite"
import HaltExecution from "./cpu/HaltExecution"
import {
	SET_MUX,
	SET_ALU_OPERATION,
	LOAD_ALU1_FROM_ACC,
	LOAD_ALU2,
	SET_PC_TO_IR_OPERAND,
	SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG,
	SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG,
	SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG,
	SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG
} from "./presets"
import { TTS_FINISHED } from "./Waits"
import Parallel from "./macro/Parallel"
import ReadStep from "./tts/ReadStep"
import StepText from "./controls/StepText"
import LoadValueOnBus from "./bus/LoadValueOnBus"

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
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU1_FROM_ACC,
				...LOAD_ALU2(instruction.immediateFlag()),
				new ExecuteAluOperation(),
				new Parallel(
					new LoadValueOnBus("ALU:RES"),
					new FlashWire("ALU:4", "ACC:2"),
					new ReadStep("execute"),
					new StepText("execute")
				),
				new FlashCpu("ACC").thenWaitFor(TTS_FINISHED).endstep(),
				new Parallel(
					// new LoadValueOnBus(?, "alu_sw_data_bus"),
					new FlashWire("ALU:3", "SW:1"),
					new ReadStep("alu_to_sw"),
					new StepText("alu_to_sw")
				),
				new UpdateSW().thenWaitFor(TTS_FINISHED).endstep()
			)
			break

		case "NOT":
			actions.push(
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU2(instruction.immediateFlag()),
				new ExecuteAluOperation(),
				new Parallel(
					new LoadValueOnBus("ALU:RES"),
					new FlashWire("ALU:4", "ACC:2"),
					new ReadStep("execute"),
					new StepText("execute")
				),
				new FlashCpu("ACC").thenWaitFor(TTS_FINISHED).endstep(),
				new Parallel(
					// new LoadValueOnBus(?, "alu_sw_data_bus"),
					new FlashWire("ALU:3", "SW:1"),
					new ReadStep("alu_to_sw"),
					new StepText("alu_to_sw")
				),
				new UpdateSW().thenWaitFor(TTS_FINISHED).endstep()
			)
			break

		case "CMP":
			actions.push(
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU1_FROM_ACC,
				...LOAD_ALU2(instruction.immediateFlag()),
				new Parallel(
					// new LoadValueOnBus(?, "alu_sw_data_bus"),
					new FlashWire("ALU:3", "SW:1"),
					new ReadStep("alu_to_sw"),
					new StepText("alu_to_sw")
				),
				new CompareUpdateSW().thenWaitFor(TTS_FINISHED).endstep()
			)
			break

		case "LOD":
			actions.push(
				...SET_MUX,
				...SET_ALU_OPERATION,
				...LOAD_ALU2(instruction.immediateFlag()),
				new ExecuteAluOperation(),
				new Parallel(
					new LoadValueOnBus("ALU:RES"),
					new FlashWire("ALU:4", "ACC:2"),
					new ReadStep("execute"),
					new StepText("execute")
				),
				new FlashCpu("ACC").thenWaitFor(TTS_FINISHED).endstep()
			)
			break

		case "STO":
			actions.push(
				new Parallel(
					new LoadValueOnBus("IR:OPR"),
					new FlashWire("IR:2", "RAM:ADD"),
					new ReadStep("ir_to_ram"),
					new StepText("ir_to_ram")
				),
				new FlashRam("ADDRESS").thenWaitFor(TTS_FINISHED).endstep(),
				new Parallel(new FlashCpu("ACC"), new ReadStep("acc_to_ram"), new StepText("acc_to_ram")),
				new Parallel(new LoadValueOnBus("ACC"), new FlashWire("ACC:1", "RAM:DATA"))
					.thenWaitFor(TTS_FINISHED)
					.endstep(),
				new Parallel(
					// new LoadValueOnBus("CU"),
					new FlashWire("CU:3", "RAM:CTRL"),
					new ReadStep("memory_write"),
					new StepText("memory_write")
				)
					.thenWaitFor(TTS_FINISHED)
					.endstep(),
				new Parallel(
					new MemoryWrite(),
					new ReadStep("acc_stored_to_ram"),
					new StepText("acc_stored_to_ram")
				)
					.thenWaitFor(TTS_FINISHED)
					.endstep()
			)
			break

		case "JMP":
			actions.push(...SET_PC_TO_IR_OPERAND)
			break

		case "JZ":
			actions.push(new FlashCpu("SW:Z"), ...SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG)
			break

		case "JNZ":
			actions.push(new FlashCpu("SW:Z"), ...SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG)
			break

		case "JN":
			actions.push(new FlashCpu("SW:N"), ...SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG)
			break

		case "JNN":
			actions.push(new FlashCpu("SW:N"), ...SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG)
			break

		case "NOP":
			actions.push()
			break

		case "HLT":
			actions.push(new HaltExecution())
			break

		default:
			throw new Error(`Unrecognized opcode: "${instruction.opcode["symbolic"]}"`)
	}
	return actions
}
