/** Base class for errors regarding the CPU */
export class CPUError extends Error {}

/** Error regarding an invalid {@link AddressingMode} value */
export class InvalidAddressingModeError extends CPUError {
	/** The invalid value that caused the error */
	public readonly value: number

	constructor(value: number) {
		super(`Invalid addressing mode: ${value.toString(2)}`)
		this.value = value
	}
}

/** Error regarding an invalid status word value */
export class InvalidStatusWordError extends CPUError {
	/** The invalid value */
	public readonly value: number

	constructor(value: number) {
		super(`Invalid status word value: ${value.toString(2).padStart(8, "0")}`)
		this.value = value
	}
}
