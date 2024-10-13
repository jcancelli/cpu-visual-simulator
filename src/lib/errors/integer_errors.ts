import type { Size } from "$lib/model/integer"

/** Thrown when a value cannot be represented in an n-bits, signed/unsigned range */
export abstract class IntegerOutOfRangeError extends Error {
	/**
	 *	@param range - Number of bits used for the range
	 *	@param signed - Wether the value is supposed to be signed or not
	 *	@param value - The value outside of the range
	 * */
	constructor(
		public readonly range: Size,
		public readonly signed: boolean,
		public readonly value: number
	) {
		super(`Value ${value} out of ${range} bit ${signed ? "signed" : "unsigned"} range`)
		Object.setPrototypeOf(this, IntegerOutOfRangeError)
	}
}

/** Thrown when a value cannot be represented in an n-bits, unsigned range */
export class IntegerOutOfUnsignedRangeError extends IntegerOutOfRangeError {
	/**
	 *	@param range - Number of bits used for the range
	 *	@param value - The value outside of the range
	 * */
	constructor(range: Size, value: number) {
		super(range, false, value)
		Object.setPrototypeOf(this, IntegerOutOfUnsignedRangeError)
	}
}

/** Thrown when a value cannot be represented in an n-bits, signed range */
export class IntegerOutOfSignedRangeError extends IntegerOutOfRangeError {
	/**
	 *	@param range - Number of bits used for the range
	 *	@param value - The value outside of the range
	 * */
	constructor(range: Size, value: number) {
		super(range, true, value)
		Object.setPrototypeOf(this, IntegerOutOfSignedRangeError)
	}
}

/** Thrown when a value has is not an integer */
export class NotAnIntegerError extends Error {
	constructor(public readonly value: number) {
		super(`Value ${value} is not an integer`)
		Object.setPrototypeOf(this, NotAnIntegerError)
	}
}
