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
	conditionalJump,
} from "./action/cpu"
import { endInstruction, endProgram, endStep, startStep } from "./action/execution"
import { ttsReadStep, waitTextToSpeechToFinish } from "./action/text_to_speech"
import { flashUI, waitUIAnimation } from "./action/animation"
import { atomic, Task } from "./task"

/** A reusable list of tasks */
export type Workflow = ReadonlyArray<Task>

/** Workflow that implements the fetch and decode steps of the fetch-decode-execute cycle */
export const FETCH_AND_DECODE_WORKFLOW: Workflow = [
	// ---- Send program counter to memory ----
	atomic(
		startStep(Step.PROGRAM_COUNTER_TO_MEMORY), //
		ttsReadStep(Step.PROGRAM_COUNTER_TO_MEMORY),
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
]

/** Workflow performed when an invalid opcode is decoded by the decoder */
export const INVALID_OPCODE_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.INVALID_OPCODE),
		ttsReadStep(Step.INVALID_OPCODE),
		//sendNotification,
		waitTextToSpeechToFinish,
		endProgram,
	),
]

/** NOP instruction workflow */
export const NOP_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.NO_OP),
		ttsReadStep(Step.NO_OP),
		waitTextToSpeechToFinish,
		incrementProgramCounterOrHaltProgram,
		endInstruction,
	),
]

/** HLT instruction workflow */
export const HLT_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.HALT), //
		ttsReadStep(Step.HALT),
		waitTextToSpeechToFinish,
		endProgram,
	),
]

/** Workflow that sends the decoded opcode to the ALU */
export const SET_ALU_OPERATION_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.SET_ALU_OPERATION), //
		ttsReadStep(Step.SET_ALU_OPERATION),
	),
	flashUI(UI.CONTROL_UNIT),
	waitUIAnimation(UI.CONTROL_UNIT),
	atomic(
		sendSignalOnBus(RegisterID.DECODER_DECODED_OPCODE, BusID.ALU_CONTROL),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.ALU_OPERATION, BusID.ALU_CONTROL),
		flashUI(UI.ALU_OPERATION),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.ALU_OPERATION),
	),
	endStep,
]

/** Workflow that sends the decoded addressing mode to the multiplexer */
export const SET_ADDRESSING_MODE_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.SET_ADDRESSING_MODE), //
		ttsReadStep(Step.SET_ADDRESSING_MODE),
	),
	flashUI(UI.CONTROL_UNIT),
	waitUIAnimation(UI.CONTROL_UNIT),
	atomic(
		sendSignalOnBus(RegisterID.CONTROL_UNIT_ADDRESSING_MODE, BusID.MUX_CONTROL),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.MUX_ADDRESSING_MODE, BusID.MUX_CONTROL), //
		flashUI(UI.MUX),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.MUX),
	),
	endStep,
]

/** Workflow that loads the accumulator as the alu first operand */
export const LOAD_ALU_OPERAND_1_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.LOAD_OPERAND_1_FROM_ACCUMULATOR),
		ttsReadStep(Step.LOAD_OPERAND_1_FROM_ACCUMULATOR),
	),
	flashUI(UI.ACCUMULATOR),
	waitUIAnimation(UI.ACCUMULATOR),
	atomic(
		sendSignalOnBus(RegisterID.ACCUMULATOR, BusID.DATA),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.ALU_OPERAND_1, BusID.DATA), //
		flashUI(UI.ALU_OPERAND_1),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.ALU_OPERAND_1),
	),
	endStep,
]

/** Workflow that loads the second operand of the ALU from the instruction register */
export const LOAD_ALU_OPERAND_2_IMMEDIATE_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.LOAD_OPERAND_2_FROM_INSTRUCTION_REGISTER),
		ttsReadStep(Step.LOAD_OPERAND_2_FROM_INSTRUCTION_REGISTER),
	),
	flashUI(UI.INSTRUCTION_REGISTER_OPERAND),
	waitUIAnimation(UI.INSTRUCTION_REGISTER_OPERAND),
	atomic(
		sendSignalOnBus(RegisterID.INSTRUCTION_REGISTER_OPERAND, BusID.ADDRESS),
		//flashWire,
	),
	//waitWireAnimation,
	readSignalFromBus(RegisterID.MUX_SIGNAL, BusID.ADDRESS),
	atomic(
		sendSignalOnBus(RegisterID.MUX_SIGNAL, BusID.MUX_ALU),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.ALU_OPERAND_2, BusID.MUX_ALU), //
		flashUI(UI.ALU_OPERAND_2),
	),
	atomic(waitTextToSpeechToFinish, waitUIAnimation(UI.ALU_OPERAND_2)),
	endStep,
]

/** Workflow that loads the second operand of the ALU from the memory */
export const LOAD_ALU_OPERAND_2_DIRECT_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.INSTRUCTION_REGISTER_OPERAND_TO_MEMORY),
		ttsReadStep(Step.INSTRUCTION_REGISTER_OPERAND_TO_MEMORY),
	),
	flashUI(UI.INSTRUCTION_REGISTER_OPERAND),
	waitUIAnimation(UI.INSTRUCTION_REGISTER_OPERAND),
	atomic(
		sendSignalOnBus(RegisterID.INSTRUCTION_REGISTER_OPERAND, BusID.ADDRESS),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.MEMORY_ADDRESS, BusID.ADDRESS),
		flashUI(UI.MEMORY_SELECTED_ADDRESS),
	),
	atomic(waitTextToSpeechToFinish, waitUIAnimation(UI.MEMORY_SELECTED_ADDRESS)),
	endStep,

	atomic(startStep(Step.SIGNAL_MEMORY_READ), ttsReadStep(Step.SIGNAL_MEMORY_READ)),
	flashUI(UI.CONTROL_UNIT),
	waitUIAnimation(UI.CONTROL_UNIT),
	atomic(
		sendSignalOnBus(RegisterID.CONTROL_UNIT_MEMORY_OPERATION, BusID.MEMORY_CONTROL),
		//flashWire,
	),
	//waitUIAnimation,
	readSignalFromBus(RegisterID.MEMORY_OPERATION, BusID.MEMORY_CONTROL),
	waitTextToSpeechToFinish,
	endStep,

	atomic(
		startStep(Step.LOAD_OPERAND_2_FROM_MEMORY), //
		ttsReadStep(Step.LOAD_OPERAND_2_FROM_MEMORY),
	),
	flashUI(UI.MEMORY_SELECTED_DATA),
	waitUIAnimation(UI.MEMORY_SELECTED_DATA),
	atomic(
		sendSignalOnBus(RegisterID.MEMORY_DATA, BusID.DATA),
		//flashWire,
	),
	//waitWireAnimation,
	readSignalFromBus(RegisterID.MUX_SIGNAL, BusID.DATA),
	atomic(
		sendSignalOnBus(RegisterID.MUX_SIGNAL, BusID.MUX_ALU),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.ALU_OPERAND_2, BusID.MUX_ALU), //
		flashUI(UI.ALU_OPERAND_2),
	),
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.ALU_OPERAND_2),
	),
	endStep,
]

/** Workflow that writes the operand stored in the instruction register into the program counter.
 * IMPORTANT: This workflow starts a step but does not end it. The end step/instruction action to end the step
 * must be appended wherever this workflow is used. */
export const OPERAND_TO_PROGRAM_COUNTER_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.OPERAND_TO_PROGRAM_COUNTER),
		ttsReadStep(Step.OPERAND_TO_PROGRAM_COUNTER),
	),
	flashUI(UI.INSTRUCTION_REGISTER_OPERAND),
	waitUIAnimation(UI.INSTRUCTION_REGISTER_OPERAND),
	atomic(
		sendSignalOnBus(RegisterID.INSTRUCTION_REGISTER_OPERAND, BusID.ADDRESS),
		//flashWire,
	),
	//waitWireAnimation,
	atomic(
		readSignalFromBus(RegisterID.PROGRAM_COUNTER, BusID.ADDRESS),
		flashUI(UI.PROGRAM_COUNTER),
	),
	atomic(
		waitUIAnimation(UI.PROGRAM_COUNTER), //
		waitTextToSpeechToFinish,
	),
]

/** JMP instruction workflow */
export const JMP_WORKFLOW: Workflow = [
	...OPERAND_TO_PROGRAM_COUNTER_WORKFLOW, //
	endInstruction,
]

/** JZ instruction workflow */
export const JZ_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.CHECK_STATUS_WORD_FLAG), //
		ttsReadStep(Step.CHECK_STATUS_WORD_FLAG),
	),
	flashUI(UI.STATUS_WORD_ZERO_FLAG),
	// The conditional jump action handler will execute the jump and end the instruction
	conditionalJump,
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.STATUS_WORD_ZERO_FLAG),
	),
	endStep,
]

/** JNZ instruction workflow */
export const JNZ_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.CHECK_STATUS_WORD_FLAG), //
		ttsReadStep(Step.CHECK_STATUS_WORD_FLAG),
	),
	flashUI(UI.STATUS_WORD_ZERO_FLAG),
	// The conditional jump action handler will execute the jump and end the instruction
	conditionalJump,
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.STATUS_WORD_ZERO_FLAG),
	),
	endStep,
]

/** JN instruction workflow */
export const JN_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.CHECK_STATUS_WORD_FLAG), //
		ttsReadStep(Step.CHECK_STATUS_WORD_FLAG),
	),
	flashUI(UI.STATUS_WORD_NEGATIVE_FLAG),
	// The conditional jump action handler will execute the jump and end the instruction
	conditionalJump,
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.STATUS_WORD_ZERO_FLAG),
	),
	endStep,
]

/** JNN instruction workflow */
export const JNN_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.CHECK_STATUS_WORD_FLAG), //
		ttsReadStep(Step.CHECK_STATUS_WORD_FLAG),
	),
	flashUI(UI.STATUS_WORD_NEGATIVE_FLAG),
	// The conditional jump action handler will execute the jump and end the instruction
	conditionalJump,
	atomic(
		waitTextToSpeechToFinish, //
		waitUIAnimation(UI.STATUS_WORD_ZERO_FLAG),
	),
	endStep,
]

/** LOD instruction workflow */
export const LOD_WORKFLOW: Workflow = []

/** STO instruction workflow */
export const STO_WORKFLOW: Workflow = []

/** ADD instruction workflow */
export const ADD_WORKFLOW: Workflow = []

/** SUB instruction workflow */
export const SUB_WORKFLOW: Workflow = []

/** MUL instruction workflow */
export const MUL_WORKFLOW: Workflow = []

/** DIV instruction workflow */
export const DIV_WORKFLOW: Workflow = []

/** Workflow for when a division by zero is performed */
export const DIVISION_BY_ZERO_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.DIVISION_BY_ZERO), //
		ttsReadStep(Step.DIVISION_BY_ZERO),
	),
	//sendNotification,
	waitTextToSpeechToFinish,
	endProgram,
]

/** AND instruction workflow */
export const AND_WORKFLOW: Workflow = []

/** CMP instruction workflow */
export const CMP_WORKFLOW: Workflow = []

/** NOT instruction workflow */
export const NOT_WORKFLOW: Workflow = []

/** Workflow to increment the program couter */
export const INCREMENT_PROGRAM_COUNTER_WORKFLOW: Workflow = [
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
]

/** Workflow performed when it's time to increment the program counter but the last valid address was reached */
export const LAST_ADDRESS_REACHED_WORKFLOW: Workflow = [
	atomic(
		startStep(Step.LAST_ADDRESS_REACHED), //
		ttsReadStep(Step.LAST_ADDRESS_REACHED),
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
]
