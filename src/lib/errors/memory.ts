import { CPUVSError } from "./cpuvs"

/** Base class for an error regarding memory. */
export abstract class MemoryError extends CPUVSError {}

/** Error regarding an unexpected value presented as memory operation. */
export class InvalidMemoryOperationError extends MemoryError {
	public readonly value: number

	constructor(value: number) {
		super(`Invalid memory operation value: ${value.toString(2)}`)
		this.value = value
	}
}
