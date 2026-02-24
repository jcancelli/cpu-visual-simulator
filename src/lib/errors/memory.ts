/** Base class for an error regarding memory. */
export abstract class MemoryError extends Error {}

/** Base class for errors regarding a memory address. */
export abstract class AddressError extends MemoryError {
	/** The address that caused the error. */
	public readonly address: number

	constructor(address: number, message: string) {
		super(message)
		this.address = address
	}
}

/** Error regarding an address that is not in the valid memory address range. */
export class AddressOutOfRangeError extends AddressError {
	constructor(address: number) {
		super(address, `Address out of range: ${address}`)
	}
}

/** Error regarding an address that doesn't match a given alignment. */
export abstract class MisalignedAddressError extends AddressError {
	/** The required alignment */
	public readonly alignment: number

	constructor(address: number, alignment: number) {
		super(address, `Address: ${address}, Alignment: ${alignment}`)
		this.alignment = alignment
	}
}

/** Error regarding an address that is not byte-aligned. */
export class InvalidByteAlignedAddressError extends MisalignedAddressError {
	constructor(address: number) {
		super(address, 1)
	}
}

/** Error regarding an address that is not word-aligned. */
export class InvalidWordAlignedAddressError extends MisalignedAddressError {
	constructor(address: number) {
		super(address, 2)
	}
}

/** Error regarding an unexpected value presented as memory operation. */
export class InvalidMemoryOperationError extends MemoryError {
	public readonly value: number

	constructor(value: number) {
		super(`Invalid memory operation value: ${value.toString(2)}`)
		this.value = value
	}
}
