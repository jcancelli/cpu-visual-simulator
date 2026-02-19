import { MemoryOperation } from "$lib/memory.svelte"
import { NotificationType } from "$lib/notifications.svelte"
import {
	awaitTextToSpeechEnd,
	flashUIElement,
	readBus,
	setMemoryOperation,
	signalBus,
	endStep,
	textToSpeechRead,
	updateStepDescription,
	endSignalBus,
	BusID,
	BusIO,
	UIElement,
	decodeInstruction,
	performMemoryOperation,
	executeInstruction,
	haltExecution,
	notifyUser,
} from "./action"
import { concurrently } from "./task_system"

export const SIGNAL_MEMORY_FETCH_ACTIONS = [
	// Start step
	concurrently(
		flashUIElement(UIElement.PROGRAM_COUNTER),
		textToSpeechRead("pc_on_address_bus"), // TODO: define step text
		updateStepDescription("pc_on_address_bus"),
	),
	// Put program counter on address bus
	concurrently(
		signalBus(BusIO.PROGRAM_COUNTER, BusID.ADDRESS),
		//flashWire(),
	),
	// Read selected address from bus
	readBus(BusIO.MEMORY, BusID.ADDRESS),
	flashUIElement(UIElement.MEMORY_ADDRESS),
	// End step
	awaitTextToSpeechEnd,
	endStep,

	// Start step and set memory operation in control unit
	concurrently(
		flashUIElement(UIElement.DECODER_CTRL_UNIT),
		setMemoryOperation(MemoryOperation.FETCH),
		textToSpeechRead("signal_memory_read"), // TODO: define step text
		updateStepDescription("signal_memory_read"),
	),
	// Put memory operation signal on the control bus
	concurrently(
		signalBus(BusIO.DECODER_CTRL_UNIT, BusID.CONTROL),
		//flashWire(),
	),
	// Read memory operation from control bus
	readBus(BusIO.MEMORY, BusID.CONTROL),
	// End step
	awaitTextToSpeechEnd,
	endStep,

	performMemoryOperation,
] as const

export const MEMORY_FETCH_ACTIONS = [
	// Start step
	concurrently(
		flashUIElement(UIElement.MEMORY_DATA),
		textToSpeechRead("memory_fetch"), // TODO: define text to speech strings
		updateStepDescription("memory_fetch"),
	),
	// Write data to data bus
	concurrently(
		signalBus(BusIO.MEMORY, BusID.DATA),
		//flashWire(ram, ir),
	),
	// Read data into instruction register
	concurrently(
		flashUIElement(UIElement.INSTRUCTION_REGISTER),
		readBus(BusIO.INSTRUCTION_REGISTER, BusID.DATA),
	),
	// End step
	awaitTextToSpeechEnd,
	endStep,

	// Clear signal from busses
	concurrently(
		endSignalBus(BusID.DATA),
		endSignalBus(BusID.ADDRESS),
		endSignalBus(BusID.CONTROL),
	),
] as const

export const MEMORY_READ_ACTIONS = [
	// Start step
	concurrently(
		flashUIElement(UIElement.MEMORY_DATA),
		textToSpeechRead("memory_read"), // TODO: define text to speech strings
		updateStepDescription("memory_read"),
	),
	// Write data to data bus
	concurrently(
		signalBus(BusIO.MEMORY, BusID.DATA),
		//flashWire(ram, mux),
	),
	// Read data into mux
	// NOTE: consider ending the step here and adding a new one that is like "mux_to_alu". See DEV_NOTES.md
	concurrently(readBus(BusIO.MUX, BusID.DATA), flashUIElement(UIElement.MUX)),
	// Send data to ALU
	concurrently(
		signalBus(BusIO.MUX, BusID.MUX_ALU),
		//flashWire(),
	),
	// Read data into ALU operand
	concurrently(flashUIElement(UIElement.ALU_OPERAND_2), readBus(BusIO.ALU, BusID.MUX_ALU)),
	// End step
	awaitTextToSpeechEnd,
	endStep,

	// Clear signal from busses
	concurrently(
		endSignalBus(BusID.DATA),
		endSignalBus(BusID.ADDRESS),
		endSignalBus(BusID.CONTROL),
		endSignalBus(BusID.MUX_ALU),
	),
] as const

export const MEMORY_WRITE_ACTIONS = [
	// Start step
	concurrently(
		flashUIElement(UIElement.MEMORY_DATA),
		textToSpeechRead("memory_read"), // TODO: define text to speech strings
		updateStepDescription("memory_read"),
	),
	// Write data to data bus
	concurrently(
		signalBus(BusIO.MEMORY, BusID.DATA),
		//flashWire(ram, mux),
	),
	// Read data into mux
	// NOTE: consider ending the step here and adding a new one that is like "mux_to_alu". See DEV_NOTES.md
	concurrently(readBus(BusIO.MUX, BusID.DATA), flashUIElement(UIElement.MUX)),
	// Send data to ALU
	concurrently(
		signalBus(BusIO.MUX, BusID.MUX_ALU),
		//flashWire(),
	),
	// Read data into ALU operand
	concurrently(flashUIElement(UIElement.ALU_OPERAND_2), readBus(BusIO.ALU, BusID.MUX_ALU)),
	// End step
	awaitTextToSpeechEnd,
	endStep,

	// Clear signal from busses
	concurrently(
		endSignalBus(BusID.DATA),
		endSignalBus(BusID.ADDRESS),
		endSignalBus(BusID.CONTROL),
		endSignalBus(BusID.MUX_ALU),
	),
] as const

export const DECODE_INSTRUCTION_ACTIONS = [
	// Start step
	concurrently(
		flashUIElement(UIElement.INSTRUCTION_REGISTER_OPCODE),
		textToSpeechRead("decode_opcode"), // TODO: define text to speech strings
		updateStepDescription("decode_opcode"),
	),
	// Opcode is written to the bus between instruction register and decoder
	concurrently(
		signalBus(BusIO.INSTRUCTION_REGISTER, BusID.OPCODE_DECODER),
		//flashWire(),
	),
	// Opcode is read by the decoder
	concurrently(
		flashUIElement(UIElement.DECODER_CTRL_UNIT),
		readBus(BusIO.DECODER_CTRL_UNIT, BusID.OPCODE_DECODER),
	),
	// Decode the instruction (the endStep should be handled by the action handler)
	decodeInstruction,
] as const

export const DECODE_INSTRUCTION_SUCCESS_ACTIONS = [
	// End the decode instruction step
	awaitTextToSpeechEnd,
	endStep,
	// Execute the instruction
	executeInstruction,
] as const

export const DECODE_INSTRUCTION_FAIL_ACTIONS = [
	// Wait for tts to finish reading the decode_opcode step
	awaitTextToSpeechEnd,
	// Notify the user of the invalid opcode
	concurrently(
		notifyUser(
			NotificationType.ERROR,
			"invalid_opcode_decoded", // TODO: define invalid opcode text
			// TODO: define a default notification timer
		),
		textToSpeechRead("invalid_opcode_decoded"), // TODO: define text to speed string
		updateStepDescription("invalid_opcode_decoded"),
	),
	// Halt execution
	awaitTextToSpeechEnd,
	haltExecution,
] as const
