import { NoSignalError } from "$lib/errors/bus"

/** Source or destination for a read/write {@link Bus} operation */
export enum Register {
	// CPU
	PROGRAM_COUNTER,
	PROGRAM_COUNTER_INCREMENTER,
	INSTRUCTION_REGISTER,
	INSTRUCTION_REGISTER_OPCODE,
	INSTRUCTION_REGISTER_OPERAND,
	DECODER,
	CONTROL_UNIT,
	MUX,
	ALU_OPERAND_1,
	ALU_OPERAND_2,
	ALU_OPERATION,
	ALU_RESULT,
	ALU_STATUS_WORD,
	ACCUMULATOR,
	STATUS_WORD,
	// Memory
	MEMORY_ADDRESS,
	MEMORY_OPERATION,
	MEMORY_DATA,
}

/** ID of a {@link Bus} */
export enum BusID {
	DATA,
	ADDRESS,
	MEMORY_CONTROL,
	OPCODE_DECODER,
	MUX_ALU,
	MUX_CONTROL,
	ALU_CONTROL,
	STATUS_WORD,
	ALU_ACCUMULATOR,
}

/** Value representing no signal on a bus */
export const NO_SIGNAL = Symbol("NO_SIGNAL")

/** Either a value or {@link NO_SIGNAL} */
export type BusSignal<T> = typeof NO_SIGNAL | T

/** Asserts that the signal carries a value.
 * @throws {NoSignalError}*/
export function assertSignal<T>(signal: BusSignal<T>): asserts signal is T {
	if (signal === NO_SIGNAL) {
		throw new NoSignalError()
	}
}
