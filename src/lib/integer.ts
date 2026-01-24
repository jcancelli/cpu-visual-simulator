export const RANGES = {
	signed: {
		8: {
			lower: -Math.pow(2, 7),
			upper: Math.pow(2, 7) - 1,
		},
		16: {
			lower: -Math.pow(2, 15),
			upper: Math.pow(2, 15) - 1,
		},
		32: {
			lower: -Math.pow(2, 31),
			upper: Math.pow(2, 31) - 1,
		},
	},
	unsigned: {
		8: {
			lower: 0,
			upper: Math.pow(2, 8) - 1,
		},
		16: {
			lower: 0,
			upper: Math.pow(2, 16) - 1,
		},
		32: {
			lower: 0,
			upper: Math.pow(2, 32) - 1,
		},
	},
} as const

export type IntSizeBits = 8 | 16 | 32
export type IntSizeBytes = 1 | 2 | 4

/** Represents a fixed size integer. Instances of this class should be consifered immutable */
export default class Integer {
	/**
	 * @param _sizeBits - Size in bits of the value
	 * @param unsignedValue - Value as unsigned integer
	 * */
	constructor(
		protected readonly _sizeBits: IntSizeBits,
		protected readonly unsignedValue: number = 0,
	) {
		if (!isInRangeUnsigned(unsignedValue, _sizeBits)) {
			throw new IntegerOutOfUnsignedRangeError(_sizeBits, unsignedValue)
		}
		if (!Number.isInteger(unsignedValue)) {
			throw new NotAnIntegerError(unsignedValue)
		}
	}

	/** Returns the signed value of the integer */
	signed(): number {
		return unsignedToSignedUnchecked(this.unsignedValue, this.sizeBits())
	}

	/** Returns the unsigned value of the integer */
	unsigned(): number {
		return this.unsignedValue
	}

	/** Return a string containing the base-2 representation of the integer */
	toBinaryString(): string {
		const leastSignificantBits = (this.unsigned() >>> 0).toString(2)
		const mostSignificantBits = "0".repeat(this.sizeBits() - leastSignificantBits.length)
		return mostSignificantBits.concat(leastSignificantBits)
	}

	/** Return a string containing the base-16 representation of the integer */
	toHexadecimalString(): string {
		const hexString = (this.unsigned() >>> 0).toString(16)
		// make sure to crop out all leading "f"s if the number was negative
		const substringStartIndex = Math.max(0, hexString.length - this.sizeBits() / 4)
		const leastSignificantDigits = hexString.substring(substringStartIndex)
		const paddingZerosCount = this.sizeBits() / 4 - leastSignificantDigits.length
		const mostSignificantDigits = "0".repeat(paddingZerosCount)
		return mostSignificantDigits.concat(leastSignificantDigits)
	}

	/** Returns a string containing the decimal representation of the integer as a signed value */
	toSignedDecimalString(): string {
		return this.signed().toString()
	}

	/** Returns a string containing the decimal representation of the integer as an unsigned value */
	toUnsignedDecimalString(): string {
		return this.unsigned().toString()
	}

	/** Size in bits of the integer */
	sizeBits(): IntSizeBits {
		return this._sizeBits
	}

	/** Size in bytes of the integer */
	sizeBytes(): IntSizeBytes {
		return (this.sizeBits() / 8) as IntSizeBytes
	}

	/**
	 * Returns wether or not the bit at position i is set
	 * @param i - If i >= 0, 0 is the msb and size-1 the lsb. If i < 0, -1 is the lsb and -size the msb.
	 * */
	bit(i: number): boolean {
		const shift = i >= 0 ? this.sizeBits() - 1 - i : Math.abs(i) - 1
		if (shift >= this.sizeBits() || shift < 0) {
			throw new Error(`Invalid bit position ${i} for integer of size ${this.sizeBits()}`)
		}
		return ((this.unsigned() >> shift) & 1) === 1
	}

	/** Creates an integer from a signed value */
	static fromSignedNumber(sizeBits: IntSizeBits, value: number): Integer {
		// signedToUnsigned already provides validation
		return new Integer(sizeBits, signedToUnsigned(value, sizeBits))
	}

	/** Creates an integer from an unsigned value */
	static fromUnsignedNumber(sizeBits: IntSizeBits, value: number): Integer {
		// constructor already provides validation
		return new Integer(sizeBits, value)
	}

	/** Creates an integer by parsing a signed value from a string */
	static fromSignedString(sizeBits: IntSizeBits, str: string): Integer {
		// validation provided by parseInt and fromSignedNumber
		const value = parseInt(str)
		return Integer.fromSignedNumber(sizeBits, value)
	}

	/** Creates an integer by parsing an unsigned value from a string */
	static fromUnsignedString(sizeBits: IntSizeBits, str: string): Integer {
		// validation provided by parseInt and fromUnsignedNumber
		const value = parseInt(str)
		return Integer.fromUnsignedNumber(sizeBits, value)
	}

	/**
	 * Creates an integer by parsing a string containing a base-2 representation of a number.
	 * Negative numbers must not contain the "-" character but will have to represented with two's
	 * complement */
	static fromBinaryString(sizeBits: IntSizeBits, str: string): Integer {
		// negative numbers should be expressed without "-"
		if (str.includes("-")) {
			throw new IntegerParsingError(`Character "-" not allowed in binary strings`)
		}
		// validation provided by parseInt and fromUnsignedNumber
		const value = parseInt(str, 2)
		return Integer.fromUnsignedNumber(sizeBits, value)
	}

	/**
	 * Creates an integer by parsing a string containing a base-16 representation of a number.
	 * Negative numbers must not contain the "-" character but will have to represented with two's
	 * complement */
	static fromHexadecimalString(sizeBits: IntSizeBits, str: string): Integer {
		// negative numbers should be expressed without "-"
		if (str.includes("-")) {
			throw new IntegerParsingError(`Character "-" not allowed in hexadecimal strings`)
		}
		// validation provided by parseInt and fromUnsignedNumber
		const value = parseInt(str, 16)
		return Integer.fromUnsignedNumber(sizeBits, value)
	}
}

/** Create 8 bits signed integer */
export function i8(value: number = 0): Integer {
	return Integer.fromSignedNumber(8, value)
}

/** Create 16 bits signed integer */
export function i16(value: number = 0): Integer {
	return Integer.fromSignedNumber(16, value)
}

/** Create 32 bits signed integer */
export function i32(value: number = 0): Integer {
	return Integer.fromSignedNumber(32, value)
}

/** Create 8 bits unsigned integer */
export function u8(value: number = 0): Integer {
	return new Integer(8, value)
}

/** Create 16 bits unsigned integer */
export function u16(value: number = 0): Integer {
	return new Integer(16, value)
}

/** Create 32 bits unsigned integer */
export function u32(value: number = 0): Integer {
	return new Integer(32, value)
}

/** Return wether a value is in the "size" bits signed range */
export function isInRangeSigned(value: number, sizeBits: IntSizeBits): boolean {
	return value >= RANGES.signed[sizeBits].lower && value <= RANGES.signed[sizeBits].upper
}

/** Return wether a value is in the "size" bits unsigned range */
export function isInRangeUnsigned(value: number, sizeBits: IntSizeBits): boolean {
	return value >= RANGES.unsigned[sizeBits].lower && value <= RANGES.unsigned[sizeBits].upper
}

/** Cast a signed integer to an unsigned integer if possible, otherwise throws an error */
export function signedToUnsigned(value: number, sizeBits: IntSizeBits): number {
	if (!isInRangeSigned(value, sizeBits)) {
		throw new IntegerOutOfSignedRangeError(sizeBits, value)
	}
	if (!Number.isInteger(value)) {
		throw new NotAnIntegerError(value)
	}
	return signedToUnsignedUnchecked(value, sizeBits)
}

/** Cast a signed integer to an unsigned integer without validating the input */
function signedToUnsignedUnchecked(value: number, sizeBits: IntSizeBits): number {
	const maxUnsigned = RANGES.unsigned[sizeBits].upper
	return value >= 0 ? value : value + maxUnsigned + 1
}

/** Cast an unsigned integer to an signed integer if possible, otherwise throws an error */
export function unsignedToSigned(value: number, sizeBits: IntSizeBits): number {
	if (!isInRangeUnsigned(value, sizeBits)) {
		throw new IntegerOutOfUnsignedRangeError(sizeBits, value)
	}
	if (!Number.isInteger(value)) {
		throw new NotAnIntegerError(value)
	}
	return unsignedToSignedUnchecked(value, sizeBits)
}

/** Cast an unsigned integer to an signed integer without validating the input */
function unsignedToSignedUnchecked(value: number, sizeBits: IntSizeBits): number {
	const maxSigned = RANGES.signed[sizeBits].upper
	const maxUnsigned = RANGES.unsigned[sizeBits].upper
	return value <= maxSigned ? value : value - maxUnsigned - 1
}

/** Thrown while parsing an integer from a string */
export class IntegerParsingError extends Error {
	constructor(message?: string) {
		super(message)
		Object.setPrototypeOf(this, IntegerParsingError)
	}
}

/** Thrown when a value cannot be represented in an n-bits, signed/unsigned range */
export abstract class IntegerOutOfRangeError extends Error {
	/**
	 *	@param sizeBits - Number of bits used for the range
	 *	@param signed - Wether the value is supposed to be signed or not
	 *	@param value - The value outside of the range
	 * */
	constructor(
		public readonly sizeBits: IntSizeBits,
		public readonly signed: boolean,
		public readonly value: number,
	) {
		super(`Value ${value} out of ${sizeBits}-bit ${signed ? "signed" : "unsigned"} range`)
		Object.setPrototypeOf(this, IntegerOutOfRangeError)
	}
}

/** Thrown when a value cannot be represented in an n-bits, unsigned range */
export class IntegerOutOfUnsignedRangeError extends IntegerOutOfRangeError {
	/**
	 *	@param sizeBits - Number of bits used for the range
	 *	@param value - The value outside of the range
	 * */
	constructor(sizeBits: IntSizeBits, value: number) {
		super(sizeBits, false, value)
		Object.setPrototypeOf(this, IntegerOutOfUnsignedRangeError)
	}
}

/** Thrown when a value cannot be represented in an n-bits, signed range */
export class IntegerOutOfSignedRangeError extends IntegerOutOfRangeError {
	/**
	 *	@param sizeBits - Number of bits used for the range
	 *	@param value - The value outside of the range
	 * */
	constructor(sizeBits: IntSizeBits, value: number) {
		super(sizeBits, true, value)
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
