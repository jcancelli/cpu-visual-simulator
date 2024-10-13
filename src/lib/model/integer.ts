import {
	NotAnIntegerError,
	IntegerOutOfSignedRangeError,
	IntegerOutOfUnsignedRangeError,
} from "$lib/errors/integer_errors"

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

/** Allowed Value sizes in bits */
export type Size = 8 | 16 | 32

/** Represents a fixed size integer. Instances of this class should be consifered immutable */
export default class Integer {
	/**
	 * @param size - Size in bits of the value
	 * @param unsignedValue - Value as unsigned integer
	 * */
	constructor(
		protected readonly size: Size,
		protected readonly unsignedValue: number = 0
	) {
		if (!isInRangeUnsigned(unsignedValue, size)) {
			throw new IntegerOutOfUnsignedRangeError(size, unsignedValue)
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
	sizeBits(): Size {
		return this.size
	}

	/** Size in bytes of the integer */
	sizeBytes(): number {
		return this.sizeBits() / 8
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
	static fromSignedNumber(size: Size, value: number): Integer {
		// signedToUnsigned already provides validation
		return new Integer(size, signedToUnsigned(value, size))
	}

	/** Creates an integer from an unsigned value */
	static fromUnsignedNumber(size: Size, value: number): Integer {
		// constructor already provides validation
		return new Integer(size, value)
	}

	/** Creates an integer by parsing a signed value from a string */
	static fromSignedString(size: Size, str: string): Integer {
		// validation provided by parseInt and fromSignedNumber
		const value = parseInt(str)
		return Integer.fromSignedNumber(size, value)
	}

	/** Creates an integer by parsing an unsigned value from a string */
	static fromUnsignedString(size: Size, str: string): Integer {
		// validation provided by parseInt and fromUnsignedNumber
		const value = parseInt(str)
		return Integer.fromUnsignedNumber(size, value)
	}

	/**
	 * Creates an integer by parsing a string containing a base-2 representation of a number.
	 * Negative numbers must not contain the "-" character but will have to represented with two's
	 * complement
	 * */
	static fromBinaryString(size: Size, str: string): Integer {
		// negative numbers should be expressed without "-"
		if (str.includes("-")) {
			throw new Error(`Character "-" not allowed in binary strings`)
		}
		// validation provided by parseInt and fromUnsignedNumber
		const value = parseInt(str, 2)
		return Integer.fromUnsignedNumber(size, value)
	}
}

/** Return wether a value is in the "size" bits signed range */
export function isInRangeSigned(value: number, size: Size): boolean {
	return value >= RANGES.signed[size].lower && value <= RANGES.signed[size].upper
}

/** Return wether a value is in the "size" bits unsigned range */
export function isInRangeUnsigned(value: number, size: Size): boolean {
	return value >= RANGES.unsigned[size].lower && value <= RANGES.unsigned[size].upper
}

/** Cast a signed integer to an unsigned integer if possible, otherwise throws an error */
export function signedToUnsigned(value: number, size: Size): number {
	if (!isInRangeSigned(value, size)) {
		throw new IntegerOutOfSignedRangeError(size, value)
	}
	if (!Number.isInteger(value)) {
		throw new NotAnIntegerError(value)
	}
	return signedToUnsignedUnchecked(value, size)
}

/** Cast a signed integer to an unsigned integer without validating the input */
function signedToUnsignedUnchecked(value: number, size: Size): number {
	const maxUnsigned = RANGES.unsigned[size].upper
	return value >= 0 ? value : value + maxUnsigned + 1
}

/** Cast an unsigned integer to an signed integer if possible, otherwise throws an error */
export function unsignedToSigned(value: number, size: Size): number {
	if (!isInRangeUnsigned(value, size)) {
		throw new IntegerOutOfUnsignedRangeError(size, value)
	}
	if (!Number.isInteger(value)) {
		throw new NotAnIntegerError(value)
	}
	return unsignedToSignedUnchecked(value, size)
}

/** Cast an unsigned integer to an signed integer without validating the input */
function unsignedToSignedUnchecked(value: number, size: Size): number {
	const maxSigned = RANGES.signed[size].upper
	const maxUnsigned = RANGES.unsigned[size].upper
	return value <= maxSigned ? value : value - maxUnsigned - 1
}
