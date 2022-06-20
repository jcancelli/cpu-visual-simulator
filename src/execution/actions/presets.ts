import FlashCpu from "./animations/FlashCpu"
import FlashRam from "./animations/FlashRam"
import FlashWire from "./animations/FlashWire"
import StoreCpuState from "./state/StoreCpuState"
import StoreRamState from "./state/StoreRamState"
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

export const INCREMENT_PC = [
	new Parallel(
		new StoreCpuState("INC"),
		new FlashWire("PC:1", "INC:2"),
		new ReadStep("pc_increment")
		// new ShowText("pc_increment")
	),
	new FlashWire("INC:1", "PC:2"),
	new IncrementPC().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const FETCH = [
	new Parallel(
		new StoreCpuState("PC"),
		new FlashCpu("PC"),
		new ReadStep("pc_to_ram")
		// new ShowText("pc_to_ram")
	),
	new FlashWire("PC:2", "RAM:ADD"),
	new FlashRam("ADDRESS", "PC").thenWaitFor(TTS_FINISHED).endstep(),
	new Parallel(
		new FlashWire("CU:3", "RAM:CTRL"),
		new ReadStep("memory_fetch")
		// new ShowText("memory_fetch")
	)
		.thenWaitFor(TTS_FINISHED)
		.endstep(),
	new Parallel(
		new StoreRamState("PC"),
		new FlashRam("DATA", "PC"),
		new ReadStep("instruction_to_ir")
		// new ShowText("instruction_to_ir")
	),
	new FlashWire("RAM:DATA", "IR:1"),
	new FetchInstruction().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const DECODE_OPCODE = [
	new Parallel(
		new FlashCpu("IR:OPC"),
		new ReadStep("opcode_to_decoder")
		// new ShowText("opcode_to_decoder")
	),
	new FlashWire("IR:3", "CU:1"),
	new FlashCpu("CU").thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_MUX = [
	new Parallel(
		new FlashWire("CU:2", "MUX:4"),
		new ReadStep("cu_sets_mux")
		// new ShowText("cu_sets_mux")
	),
	new FlashCpu("MUX").thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_ALU_OPERATION = [
	new Parallel(
		new FlashWire("CU:4", "ALU:5"),
		new ReadStep("cu_sets_operation")
		// new ShowText("cu_sets_operation")
	),
	new SetAluOperation().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const LOAD_ALU1_FROM_ACC = [
	new Parallel(
		new StoreCpuState("ACC"),
		new FlashCpu("ACC"),
		new ReadStep("acc_to_alu1")
		// new ShowText("acc_to_alu1")
	),
	new FlashWire("ACC:1", "ALU:1"),
	new AccToAlu1().thenWaitFor(TTS_FINISHED).endstep()
] as const

export function LOAD_ALU2(immediateFlag: boolean) {
	return immediateFlag ? LOAD_ALU2_FROM_IR : LOAD_ALU2_FROM_RAM
}

export const LOAD_ALU2_FROM_IR = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("alu2_from_ir")
		// new ShowText("alu2_from_ir")
	),
	new FlashWire("IR:2", "MUX:1"),
	new FlashWire("MUX:3", "ALU:2"),
	new SetAlu2("IR:OPR").thenWaitFor(TTS_FINISHED).endstep()
] as const

export const LOAD_ALU2_FROM_RAM = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	),
	new FlashWire("IR:2", "RAM:ADD"),
	new FlashRam("ADDRESS", "IR:OPR").thenWaitFor(TTS_FINISHED).endstep(),
	new Parallel(
		new FlashCpu("CU"),
		new ReadStep("")
		// new ShowText("")
	),
	new FlashWire("CU:3", "RAM:CTRL").thenWaitFor(TTS_FINISHED).endstep(),
	new Parallel(
		new StoreRamState("IR:OPR"),
		new FlashRam("DATA", "IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	),
	new FlashWire("RAM:DATA", "MUX:2"),
	new FlashWire("MUX:3", "ALU:2"),
	new SetAlu2("RAM").thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	),
	new FlashWire("IR:2", "PC:2"),
	new JumpToIROperand().thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	).condition(ZERO_FLAG_SET),
	new FlashWire("IR:2", "PC:2").condition(ZERO_FLAG_SET),
	new JumpToIROperand().condition(ZERO_FLAG_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	).condition(ZERO_FLAG_NOT_SET),
	new FlashWire("IR:2", "PC:2").condition(ZERO_FLAG_NOT_SET),
	new JumpToIROperand().condition(ZERO_FLAG_NOT_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	).condition(NEGATIVE_FLAG_SET),
	new FlashWire("IR:2", "PC:2").condition(NEGATIVE_FLAG_SET),
	new JumpToIROperand().condition(NEGATIVE_FLAG_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const

export const SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG = [
	new Parallel(
		new FlashCpu("IR:OPR"),
		new ReadStep("")
		// new ShowText("")
	).condition(NEGATIVE_FLAG_NOT_SET),
	new FlashWire("IR:2", "PC:2").condition(NEGATIVE_FLAG_NOT_SET),
	new JumpToIROperand().condition(NEGATIVE_FLAG_NOT_SET).thenWaitFor(TTS_FINISHED).endstep()
] as const
