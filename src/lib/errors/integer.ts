/** Base class for errors regarding numeric values out of a specific n-bits signed/unsigned range */
export abstract class IntegerOutOfRangeError extends Error {
	constructor(bits: 8 | 16, signed: boolean, value: number) {
		super(`value: ${value} out of ${bits}-bit ${signed ? "signed" : "unsigned"} range`)
	}
}

/** Error regarding numeric values out of 8-bit unsigned integer valid range */
export class InvalidU8Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(8, false, value)
	}
}

/** Error regarding numeric values out of 8-bit signed integer valid range */
export class InvalidI8Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(8, true, value)
	}
}

/** Error regarding numeric values out of 16-bit unsigned integer valid range */
export class InvalidU16Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(16, false, value)
	}
}

/** Error regarding numeric values out of 16-bit signed integer valid range */
export class InvalidI16Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(16, true, value)
	}
}
