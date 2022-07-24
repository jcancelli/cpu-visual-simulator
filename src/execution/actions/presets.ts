import FlashCpu from "./animations/FlashCpu"
import FlashRam from "./animations/FlashRam"
import FlashWire from "./animations/FlashWire"
import AccToAlu1 from "./cpu/AccToAlu1"
import FetchInstruction from "./cpu/FetchInstruction"
import IncrementPC from "./cpu/IncrementPC"
import JumpToIROperand from "./cpu/JumpToIROperand"
import SetAlu2 from "./cpu/SetAlu2"
import SetAluOperation from "./cpu/SetAluOperation"
import {
	ZERO_FLAG_SET,
	ZERO_FLAG_NOT_SET,
	NEGATIVE_FLAG_SET,
	NEGATIVE_FLAG_NOT_SET
} from "./Conditions"
import ReadStep from "./tts/ReadStep"
import Parallel from "./macro/Parallel"
import { TTS_FINISHED } from "./Waits"
import StepText from "./controls/StepText"
import LoadValueOnBus from "./bus/LoadValueOnBus"

export const INCREMENT_PC = [
	new Parallel(
		new LoadValueOnBus("PC"),
		new FlashWire("PC:1", "INC:2"),
		new ReadStep("pc_increment"),
		new StepText("pc_increment")
	),
	new LoadValueOnBus("INC"), // should be PC + INC, not just INC
	new FlashWire("INC:1", "PC:2"),
	new IncrementPC().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const FETCH = [
	new Parallel(new FlashCpu("PC"), new ReadStep("pc_to_ram"), new StepText("pc_to_ram")),
	new Parallel(new LoadValueOnBus("PC"), new FlashWire("PC:2", "RAM:ADD")),
	new FlashRam("ADDRESS").thenWaitFor(TTS_FINISHED).endstep(),
	new Parallel(
		// new LoadValueOnBus("CU"),
		new FlashWire("CU:3", "RAM:CTRL"),
		new ReadStep("memory_fetch"),
		new StepText("memory_fetch")
	)
		.thenWaitFor(TTS_FINISHED)
		.endstep(),
	new Parallel(new FlashRam("DATA"), new ReadStep("ram_to_ir"), new StepText("ram_to_ir")),
	new Parallel(new LoadValueOnBus("RAM"), new FlashWire("RAM:DATA", "IR:1")),
	new FetchInstruction().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const DECODE_OPCODE = [
	new Parallel(new FlashCpu("IR:OPC"), new ReadStep("ir_to_cu"), new StepText("ir_to_cu")),
	new Parallel(new LoadValueOnBus("IR:OPC"), new FlashWire("IR:3", "CU:1")),
	new FlashCpu("CU").thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_MUX = [
	new Parallel(
		// new LoadValueOnBus("CU"),
		new FlashWire("CU:2", "MUX:4"),
		new ReadStep("cu_to_mux"),
		new StepText("cu_to_mux")
	),
	new FlashCpu("MUX").thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_ALU_OPERATION = [
	new Parallel(
		// new LoadValueOnBus("CU"),
		new FlashWire("CU:4", "ALU:5"),
		new ReadStep("cu_to_alu"),
		new StepText("cu_to_alu")
	),
	new SetAluOperation().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const LOAD_ALU1_FROM_ACC = [
	new Parallel(new FlashCpu("ACC"), new ReadStep("acc_to_alu1"), new StepText("acc_to_alu1")),
	new Parallel(new LoadValueOnBus("ACC"), new FlashWire("ACC:1", "ALU:1")),
	new AccToAlu1().thenWaitFor(TTS_FINISHED).endstep()
] as const

export function LOAD_ALU2(immediateFlag: boolean) {
	return immediateFlag ? LOAD_ALU2_FROM_IR : LOAD_ALU2_FROM_RAM
}

export const LOAD_ALU2_FROM_IR = [
	new Parallel(new FlashCpu("IR:OPR"), new ReadStep("ir_to_alu2"), new StepText("ir_to_alu2")),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "MUX:1")),
	new Parallel(new LoadValueOnBus("IR:OPR", "mux_alu_data_bus"), new FlashWire("MUX:3", "ALU:2")),
	new SetAlu2().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const LOAD_ALU2_FROM_RAM = [
	new Parallel(new FlashCpu("IR:OPR"), new ReadStep("ir_to_ram"), new StepText("ir_to_ram")),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "RAM:ADD")),
	new FlashRam("ADDRESS").thenWaitFor(TTS_FINISHED).endstep(),
	new Parallel(new FlashCpu("CU"), new ReadStep("memory_read"), new StepText("memory_read")),
	new Parallel(
		// new LoadValueOnBus("CU"),
		new FlashWire("CU:3", "RAM:CTRL").thenWaitFor(TTS_FINISHED).endstep()
	),
	new Parallel(new FlashRam("DATA"), new ReadStep("ram_to_alu2"), new StepText("ram_to_alu2")),
	new Parallel(new LoadValueOnBus("RAM"), new FlashWire("RAM:DATA", "MUX:2")),
	new Parallel(new LoadValueOnBus("RAM", "mux_alu_data_bus"), new FlashWire("MUX:3", "ALU:2")),
	new SetAlu2().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND = [
	new Parallel(new FlashCpu("IR:OPR"), new ReadStep("ir_to_pc"), new StepText("ir_to_pc")),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "PC:2")),
	new JumpToIROperand().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("ir_to_pc"),
		new StepText("ir_to_pc")
	).condition(ZERO_FLAG_SET),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "PC:2")).condition(
		ZERO_FLAG_SET
	),
	new JumpToIROperand().condition(ZERO_FLAG_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("ir_to_pc"),
		new StepText("ir_to_pc")
	).condition(ZERO_FLAG_NOT_SET),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "PC:2")).condition(
		ZERO_FLAG_NOT_SET
	),
	new JumpToIROperand().condition(ZERO_FLAG_NOT_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("ir_to_pc"),
		new StepText("ir_to_pc")
	).condition(NEGATIVE_FLAG_SET),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "PC:2")).condition(
		NEGATIVE_FLAG_SET
	),
	new JumpToIROperand().condition(NEGATIVE_FLAG_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("ir_to_pc"),
		new StepText("ir_to_pc")
	).condition(NEGATIVE_FLAG_NOT_SET),
	new Parallel(new LoadValueOnBus("IR:OPR"), new FlashWire("IR:2", "PC:2")).condition(
		NEGATIVE_FLAG_NOT_SET
	),
	new JumpToIROperand().condition(NEGATIVE_FLAG_NOT_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const
