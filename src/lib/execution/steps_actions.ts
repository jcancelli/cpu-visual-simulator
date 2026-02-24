import { BusID, Register } from "$lib/types/bus"
import { ExecutionStep as Step } from "$lib/types/execution"
import { UI } from "$lib/types/ui"
import { readSignalFromBus, sendSignalOnBus } from "./actions/bus"
import { decodeOpcode, setMemoryFetchOperation } from "./actions/cpu"
import { endStep, startStep } from "./actions/execution"
import { ttsReadStep, waitTextToSpeechToFinish } from "./actions/text_to_speech"
import { flashUI, waitUIAnimation } from "./actions/animation"
import { concurrently } from "./task"

/** Actions that implement the start of a fetch-decode-execute cycle */
export const FETCH_AND_DECODE_ACTIONS = [
	// ---- Send program counter to memory ----
	concurrently(
		startStep(Step.PROGRAM_COUNTER_TO_ADDRESS_BUS),
		ttsReadStep(Step.PROGRAM_COUNTER_TO_ADDRESS_BUS),
	),
	flashUI(UI.PROGRAM_COUNTER),
	waitUIAnimation(UI.PROGRAM_COUNTER),
	concurrently(
		sendSignalOnBus(Register.PROGRAM_COUNTER, BusID.ADDRESS),
		//flashWire,
	),
	//waitWireAnimation,
	readSignalFromBus(Register.MEMORY_ADDRESS, BusID.ADDRESS),
	flashUI(UI.MEMORY_SELECTED_ADDRESS),
	waitTextToSpeechToFinish,
	waitUIAnimation(UI.MEMORY_SELECTED_ADDRESS),
	endStep,

	// ---- Signal memory fetch ----
	concurrently(
		startStep(Step.SIGNAL_MEMORY_FETCH), //
		ttsReadStep(Step.SIGNAL_MEMORY_FETCH),
	),
	setMemoryFetchOperation,
	flashUI(UI.CONTROL_UNIT),
	waitUIAnimation(UI.CONTROL_UNIT),
	concurrently(
		sendSignalOnBus(Register.CONTROL_UNIT, BusID.MEMORY_CONTROL),
		//flashWire,
	),
	//waitWireAnimation,
	readSignalFromBus(Register.MEMORY_OPERATION, BusID.MEMORY_CONTROL),
	waitTextToSpeechToFinish,
	endStep,

	// ---- Read memory and write into instruction register ----
	concurrently(
		startStep(Step.MEMORY_TO_INSTRUCTION_REGISTER),
		ttsReadStep(Step.MEMORY_TO_INSTRUCTION_REGISTER),
	),
	flashUI(UI.MEMORY_SELECTED_DATA),
	waitUIAnimation(UI.MEMORY_SELECTED_DATA),
	concurrently(
		sendSignalOnBus(Register.MEMORY_DATA, BusID.DATA),
		//flasWire,
	),
	//waitWireAnimation,
	concurrently(
		readSignalFromBus(Register.INSTRUCTION_REGISTER, BusID.DATA),
		flashUI(UI.INSTRUCTION_REGISTER),
	),
	waitTextToSpeechToFinish,
	waitUIAnimation(UI.INSTRUCTION_REGISTER),
	endStep,

	// ---- Decode the opcode ----
	concurrently(
		startStep(Step.DECODE_OPCODE), //
		ttsReadStep(Step.DECODE_OPCODE),
	),
	flashUI(UI.INSTRUCTION_REGISTER_OPCODE),
	waitUIAnimation(UI.INSTRUCTION_REGISTER_OPCODE),
	concurrently(
		sendSignalOnBus(Register.INSTRUCTION_REGISTER_OPCODE, BusID.OPCODE_DECODER),
		//flasWire,
	),
	//waitWireAnimation,
	readSignalFromBus(Register.DECODER, BusID.OPCODE_DECODER),
	flashUI(UI.DECODER),
	concurrently(
		waitTextToSpeechToFinish,
		waitUIAnimation(UI.DECODER),
		decodeOpcode,
		// At this point it is responsability of the decoder to end the step and procede with the execution
	),
] as const
