import { BusID, RegisterID } from "$lib/types/bus"
import { ExecutionStep as Step } from "$lib/types/execution"
import { UI } from "$lib/types/ui"
import { readSignalFromBus, sendSignalOnBus } from "./action/bus"
import {
	decodeOpcode,
	incrementProgramCounterOrHaltProgram,
	incrementAddress,
	resetProgramCounter,
	setMemoryFetchOperation,
} from "./action/cpu"
import { endInstruction, endProgram, endStep, startStep } from "./action/execution"
import { ttsReadStep, waitTextToSpeechToFinish } from "./action/text_to_speech"
import { flashUI, waitUIAnimation } from "./action/animation"
import { atomic } from "./task"

/** Actions that implement the start of a fetch-decode-execute cycle */
export const FETCH_AND_DECODE_ACTIONS = [
	// ---- Send program counter to memory ----
	atomic(
		startStep(Step.PROGRAM_COUNTER_TO_ADDRESS_BUS),
		ttsReadStep(Step.PROGRAM_COUNTER_TO_ADDRESS_BUS),
	),
	flashUI(UI.PROGRAM_COUNTER),
	waitUIAnimation(UI.PROGRAM_COUNTER),
	atomic(
		sendSignalOnBus(RegisterID.PROGRAM_COUNTER, BusID.ADDRESS),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.MEMORY_ADDRESS, BusID.ADDRESS),
		flashUI(UI.MEMORY_SELECTED_ADDRESS),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.MEMORY_SELECTED_ADDRESS),
		endStep,
	),

	// ---- Signal memory fetch ----
	atomic(
		startStep(Step.SIGNAL_MEMORY_FETCH), //
		ttsReadStep(Step.SIGNAL_MEMORY_FETCH),
	),
	atomic(
		setMemoryFetchOperation, //
		flashUI(UI.CONTROL_UNIT),
	),
	waitUIAnimation(UI.CONTROL_UNIT),
	atomic(
		sendSignalOnBus(RegisterID.CONTROL_UNIT_MEMORY_OPERATION, BusID.MEMORY_CONTROL),
		//flashWire,
	),
	//waitWireAnimation,
	readSignalFromBus(RegisterID.MEMORY_OPERATION, BusID.MEMORY_CONTROL),
	atomic(
		waitTextToSpeechToFinish, //
		endStep,
	),

	// ---- Read memory and write into instruction register ----
	atomic(
		startStep(Step.MEMORY_TO_INSTRUCTION_REGISTER),
		ttsReadStep(Step.MEMORY_TO_INSTRUCTION_REGISTER),
	),
	flashUI(UI.MEMORY_SELECTED_DATA),
	waitUIAnimation(UI.MEMORY_SELECTED_DATA),
	atomic(
		sendSignalOnBus(RegisterID.MEMORY_DATA, BusID.DATA),
		//flasWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.INSTRUCTION_REGISTER, BusID.DATA),
		flashUI(UI.INSTRUCTION_REGISTER),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.INSTRUCTION_REGISTER),
		endStep,
	),

	// ---- Decode the opcode ----
	atomic(
		startStep(Step.DECODE_OPCODE), //
		ttsReadStep(Step.DECODE_OPCODE),
	),
	flashUI(UI.INSTRUCTION_REGISTER_OPCODE),
	waitUIAnimation(UI.INSTRUCTION_REGISTER_OPCODE),
	atomic(
		sendSignalOnBus(RegisterID.INSTRUCTION_REGISTER_OPCODE, BusID.OPCODE_DECODER),
		//flasWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.DECODER_INPUT, BusID.OPCODE_DECODER), //
		flashUI(UI.DECODER),
	),
	atomic(
		waitTextToSpeechToFinish,
		waitUIAnimation(UI.DECODER),
		decodeOpcode,
		// At this point it is responsability of the decode opcode action handler to procede with the execution
	),
	endStep,
] as const

/** Actions that implement what happens when an invalid opcode is decoded by the decoder */
export const INVALID_OPCODE_ACTIONS = [
	atomic(
		startStep(Step.INVALID_OPCODE),
		ttsReadStep(Step.INVALID_OPCODE),
		//sendNotification,
		waitTextToSpeechToFinish,
		endProgram,
	),
] as const

/** Actions that implement the NOP instruction */
export const NOP_ACTIONS = [
	atomic(
		startStep(Step.NO_OP),
		ttsReadStep(Step.NO_OP),
		waitTextToSpeechToFinish,
		endStep,
		incrementProgramCounterOrHaltProgram,
	),
] as const

/** Actions that implement the HLT instruction */
export const HLT_ACTIONS = [
	atomic(
		startStep(Step.HALT), //
		ttsReadStep(Step.HALT),
		waitTextToSpeechToFinish,
		endProgram,
	),
] as const

/** Actions that implement the JMP instruction */
export const JMP_ACTIONS = [
	atomic(
		startStep(Step.DIRECT_OPERAND_TO_ADDRESS_BUS),
		ttsReadStep(Step.DIRECT_OPERAND_TO_ADDRESS_BUS),
	),
] as const

/** Actions that implement the JZ instruction */
export const JZ_ACTIONS = [] as const

/** Actions that implement the JNZ instruction */
export const JNZ_ACTIONS = [] as const

/** Actions that implement the JN instruction */
export const JN_ACTIONS = [] as const

/** Actions that implement the JNN instruction */
export const JNN_ACTIONS = [] as const

/** Actions that implement the LOD instruction */
export const LOD_ACTIONS = [] as const

/** Actions that implement the STO instruction */
export const STO_ACTIONS = [] as const

/** Actions that implement the ADD instruction */
export const ADD_ACTIONS = [] as const

/** Actions that implement the SUB instruction */
export const SUB_ACTIONS = [] as const

/** Actions that implement the MUL instruction */
export const MUL_ACTIONS = [] as const

/** Actions that implement the DIV instruction */
export const DIV_ACTIONS = [] as const

/** Tasks to perform when a division by zero occurs */
export const DIVISION_BY_ZERO_TASKS = [
	atomic(startStep(Step.DIVISION_BY_ZERO), ttsReadStep(Step.DIVISION_BY_ZERO)),
	//sendNotification,
	waitTextToSpeechToFinish,
	endProgram,
] as const

/** Actions that implement the AND instruction */
export const AND_ACTIONS = [] as const

/** Actions that implement the CMP instruction */
export const CMP_ACTIONS = [] as const

/** Actions that implement the NOT instruction */
export const NOT_ACTIONS = [] as const

/** Actions that implement the incrementing of the program counter */
export const INCREMENT_PROGRAM_COUNTER_ACTIONS = [
	atomic(
		startStep(Step.INCREMENT_PROGRAM_COUNTER), //
		ttsReadStep(Step.INCREMENT_PROGRAM_COUNTER),
	),
	flashUI(UI.PROGRAM_COUNTER),
	waitUIAnimation(UI.PROGRAM_COUNTER),
	atomic(
		sendSignalOnBus(RegisterID.PROGRAM_COUNTER, BusID.ADDRESS),
		//flashWire,
	),
	//waitWireAnimation,
	readSignalFromBus(RegisterID.PROGRAM_COUNTER_INCREMENTER, BusID.ADDRESS),
	atomic(
		incrementAddress, //
		flashUI(UI.PROGRAM_COUNTER_INCREMENT),
	),
	atomic(
		sendSignalOnBus(RegisterID.PROGRAM_COUNTER_INCREMENTER, BusID.ADDRESS),
		//flashWire,
	),
	atomic(
		waitUIAnimation(UI.PROGRAM_COUNTER_INCREMENT), //
		//waitWireAnimation,
	),
	atomic(
		readSignalFromBus(RegisterID.PROGRAM_COUNTER, BusID.ADDRESS), //
		flashUI(UI.PROGRAM_COUNTER),
	),
	atomic(
		waitUIAnimation(UI.PROGRAM_COUNTER), //
		waitTextToSpeechToFinish,
	),
	endInstruction,
] as const

/** Actions that implement the behaviour of when the program counter reached the last address */
export const MAX_ADDRESS_REACHED_ACTIONS = [
	atomic(
		startStep(Step.MAX_ADDRESS_REACHED), //
		ttsReadStep(Step.MAX_ADDRESS_REACHED),
	),
	atomic(
		resetProgramCounter, //
		flashUI(UI.PROGRAM_COUNTER),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.PROGRAM_COUNTER),
	),
	endProgram,
] as const
