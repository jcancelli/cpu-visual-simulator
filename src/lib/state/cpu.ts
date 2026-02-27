import type { AddressingModeRegister } from "$lib/register/addressing_mode"
import type { MemoryOperationRegister } from "$lib/register/memory_operation"
import type { OpcodeRegister } from "$lib/register/opcode"
import type { ByteRegister, WordRegister } from "$lib/register/register.svelte"
import type { StatusWordRegister } from "$lib/register/status_word"
import type { WordAddressRegister } from "$lib/register/word_address"

/** State of the CPU */
export interface CPU {
	readonly instructionRegister: WordRegister
	readonly programCounter: WordAddressRegister
	readonly programCounterIncrementer: WordAddressRegister
	readonly decoder: Decoder
	readonly controlUnit: ControlUnit
	readonly arithmeticLogicUnit: ArithmeticLogicUnit
	readonly statusWord: StatusWordRegister
	readonly accumulator: WordRegister
}

/** State of the decoder */
export interface Decoder {
	/** The last value read from the instruction register */
	readonly input: ByteRegister
	/** The last opcode that was successfully decoded without any eventual immediate flag.
	 * Emphasis on "last" and "successfully", meaning that it does not necessarily reflect the value
	 * that was read from the instruction register. */
	readonly decodedOpcode: OpcodeRegister
	/** The state of the immediate flag of the last opcode that was successfully decoded.
	 * Emphasis on "last" and "successfully", meaning that it does not necessarily reflect the value
	 * that was read from the instruction register. */
	decodedImmediateFlag: boolean
}

/** State of the control unit */
export interface ControlUnit {
	/** The addressing mode that should be signaled to the multiplexer */
	readonly addressingMode: AddressingModeRegister
	/** The memory operation that should be signaled to the memory */
	readonly memoryOperation: MemoryOperationRegister
}

/** State of the multiplexer */
export interface Multiplexer {
	/** The addressing mode currently selected */
	readonly addressingMode: AddressingModeRegister
}

/** State of the arithmetic-logic unit */
export interface ArithmeticLogicUnit {
	/** The first operand for the current operation */
	readonly operand1: WordRegister
	/** The second operand for the current operation */
	readonly operand2: WordRegister
	/** The operation currently selected */
	readonly operation: OpcodeRegister
	/** The result of the last operation */
	readonly result: WordRegister
	/** Value of the status word internally stored by the ALU. It either represents the last value
	 * read from the actual status word register or the updated status word value that should be sent
	 * to the actual status word register. */
	readonly statusWord: StatusWordRegister
}
