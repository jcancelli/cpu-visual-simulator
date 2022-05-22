import FlashCpu from "./animations/FlashCpu"
import FlashRam from "./animations/FlashRam"
import FlashWire from "./animations/FlashWire"
import CacheCpu from "./cache/CacheCpu"
import CacheRam from "./cache/CacheRam"
import AccToAlu1 from "./cpu/AccToAlu1"
import FetchInstruction from "./cpu/FetchInstruction"
import IncrementPC from "./cpu/IncrementPc"
import JumpToIROperand from "./cpu/JumpToIROperand"
import SetAlu2 from "./cpu/SetAlu2"
import SetAluOperation from "./cpu/SetAluOperation"
import {
	ZERO_FLAG_SET,
	ZERO_FLAG_NOT_SET,
	NEGATIVE_FLAG_SET,
	NEGATIVE_FLAG_NOT_SET
} from "./Conditions"

export const INCREMENT_PC = [
	new CacheCpu("INC").sideffects(new FlashWire("PC:1", "INC:2")),
	new FlashWire("INC:1", "PC:2"),
	new IncrementPC().sideffects(new FlashCpu("PC"))
] as const

export const FETCH = [
	new CacheCpu("PC").sideffects(new FlashCpu("PC")),
	new FlashWire("PC:2", "RAM:ADD"),
	new FlashRam("ADDRESS", "PC"),
	new FlashWire("CU:3", "RAM:CTRL"),
	new CacheRam("PC").sideffects(new FlashRam("DATA", "PC")),
	new FlashWire("RAM:DATA", "IR:1"),
	new FetchInstruction().sideffects(new FlashCpu("IR")),
	new FlashWire("IR:3", "CU:1"),
	new FlashCpu("CU")
] as const

export const DECODE_OPCODE = [
	new FlashCpu("IR:OPC"),
	new FlashWire("IR:2", "CU:1"),
	new FlashCpu("CU")
] as const

export const SET_MUX = [new FlashWire("CU:2", "MUX:4"), new FlashCpu("MUX")] as const

export const SET_ALU_OPERATION = [
	new FlashWire("CU:3", "ALU:5"),
	new SetAluOperation().sideffects(new FlashCpu("ALU:OPR"))
] as const

export const LOAD_ALU1_FROM_ACC = [
	new CacheCpu("ACC").sideffects(new FlashCpu("ACC")),
	new FlashWire("ACC:2", "ALU:1"),
	new AccToAlu1().sideffects(new FlashCpu("ALU:1"))
] as const

export function LOAD_ALU2(immediateFlag: boolean) {
	return immediateFlag ? LOAD_ALU2_FROM_IR : LOAD_ALU2_FROM_RAM
}

export const LOAD_ALU2_FROM_IR = [
	new FlashCpu("IR:OPR"),
	new FlashWire("IR:3", "MUX:1"),
	new FlashWire("MUX:3", "ALU:2"),
	new SetAlu2("IR:OPR").sideffects(new FlashCpu("ALU:2"))
] as const

export const LOAD_ALU2_FROM_RAM = [
	new FlashCpu("IR:OPR"),
	new FlashWire("IR:3", "RAM:ADD"),
	new FlashRam("ADDRESS", "IR:OPR"),
	new FlashCpu("CU"),
	new FlashWire("CU:4", "RAM:CTRL"),
	new CacheRam("IR:OPR").sideffects(new FlashRam("DATA", "IR:OPR")),
	new FlashWire("RAM:DATA", "MUX:2"),
	new FlashWire("MUX:3", "ALU:2"),
	new SetAlu2("RAM").sideffects(new FlashCpu("ALU:2"))
] as const

export const SET_PC_TO_IR_OPERAND = [
	new FlashCpu("IR:OPR"),
	new FlashWire("IR:2", "PC:2"),
	new JumpToIROperand().sideffects(new FlashCpu("PC"))
] as const

export const SET_PC_TO_IR_OPERAND_IF_ZERO_FLAG = [
	new FlashCpu("IR:OPR").condition(ZERO_FLAG_SET),
	new FlashWire("IR:2", "PC:2").condition(ZERO_FLAG_SET),
	new JumpToIROperand().condition(ZERO_FLAG_SET).sideffects(new FlashCpu("PC"))
] as const

export const SET_PC_TO_IR_OPERAND_IF_NOT_ZERO_FLAG = [
	new FlashCpu("IR:OPR").condition(ZERO_FLAG_NOT_SET),
	new FlashWire("IR:2", "PC:2").condition(ZERO_FLAG_NOT_SET),
	new JumpToIROperand().condition(ZERO_FLAG_NOT_SET).sideffects(new FlashCpu("PC"))
] as const

export const SET_PC_TO_IR_OPERAND_IF_NEGATIVE_FLAG = [
	new FlashCpu("IR:OPR").condition(NEGATIVE_FLAG_SET),
	new FlashWire("IR:2", "PC:2").condition(NEGATIVE_FLAG_SET),
	new JumpToIROperand().condition(NEGATIVE_FLAG_SET).sideffects(new FlashCpu("PC"))
] as const

export const SET_PC_TO_IR_OPERAND_IF_NOT_NEGATIVE_FLAG = [
	new FlashCpu("IR:OPR").condition(NEGATIVE_FLAG_NOT_SET),
	new FlashWire("IR:2", "PC:2").condition(NEGATIVE_FLAG_NOT_SET),
	new JumpToIROperand().condition(NEGATIVE_FLAG_NOT_SET).sideffects(new FlashCpu("PC"))
] as const
