import { CPUVSError } from "./cpuvs"

/** Base class for errors regarding a memory address */
export abstract class AddressError extends CPUVSError {}

/** Error regarding an address that is not in the valid memory address range. */
export class AddressOutOfRangeError extends AddressError {
	/** The value that caused the error */
	public readonly address: number

	constructor(address: number) {
		super(`Address out of range: ${address}`)
		this.address = address
	}
}

/** Error regarding an address that doesn't match a given alignment. */
export abstract class MisalignedAddressError extends AddressError {
	/** The value that caused the error */
	public readonly address: number
	/** The required alignment */
	public readonly alignment: number

	constructor(address: number, alignment: number) {
		super(`Address: ${address}, Alignment: ${alignment}`)
		this.address = address
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
