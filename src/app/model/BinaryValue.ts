import BinaryValueOutOfRange from "../errors/BinaryValueOutOfRange"
import {
	checkValidBitCount,
	isValidBinary,
	pad,
	setBit,
	valueIsInRange,
	numberToBinaryString
} from "../util/binary"
import { positionToIndex } from "../../shared/util/string"

/** The allowed sizes for a BinaryValue instance in bits */
export type BinaryValueSize = 8 | 16 | 32

/** Represents a numeric value */
export default class BinaryValue {
	/** The value of its instance represented as a binary string */
	protected readonly value: string

	/**
	 *
	 * @param {BinaryValueSize} bits - The size of the value in bits. Can be either 8, 16 or 32
	 * @param {number|string|BinaryValue} value - Can either be a number (both signed or unsigned),
	 * a string (only a string that represents a binary value) or another BinaryValue
	 */
	constructor(bits: BinaryValueSize, value: number | string | BinaryValue) {
		if (typeof value === "string") {
			if (!isValidBinary(value, bits)) {
				throw new BinaryValueOutOfRange(value, bits)
			}
			this.value = pad(value, bits)
		} else if (typeof value === "number") {
			if (!valueIsInRange(value, bits)) {
				throw new BinaryValueOutOfRange(value, bits)
			}
			this.value = numberToBinaryString(value, bits)
		} else {
			this.value = numberToBinaryString(value.signed(), bits) // TEST THIS
		}
	}

	/**
	 * Returns the numeric signed value of its instance
	 * @returns {number}
	 */
	signed(): number {
		if (this.value.startsWith("0")) {
			return parseInt(this.value, 2)
		} else {
			return ~~parseInt(("11111111111111111111111111111111" + this.value).slice(-32), 2)
		}
	}

	/**
	 * Returns the numeric unsigned value of its instance
	 * @returns {number}
	 */
	unsigned(): number {
		return parseInt(this.value, 2)
	}

	/**
	 * Returns a string that containing the binary value of its instance
	 * @returns {string}
	 */
	toBinaryString(): string {
		return this.value
	}

	/**
	 * Returns the size of the value represented by its instance in bits
	 * @returns {BinaryValueSize}
	 */
	bits(): BinaryValueSize {
		return this.value.length as BinaryValueSize
	}

	/**
	 * Returns the size of the value represented by its instance in bytes
	 * @returns {number}
	 */
	bytes(): number {
		return this.bits() / 8
	}

	/**
	 * Returns the byte at the specified index
	 * @param {number} pos - The index of the byte that should be returned.
	 * Can either be a positive value from 1 to this.bytes() or a negative value from -1 to -this.bytes().
	 * A negative value starts from the least significant byte while a positive value starts from the most significant byte
	 * @returns {BinaryValue}
	 */
	getByte(pos: number): BinaryValue {
		const index = positionToIndex(pos, this.bytes()) * 8
		return new BinaryValue(8, this.value.substring(index, index + 8))
	}

	/**
	 * Returns the value of its instance splitted into an array of BinaryValues of a size of 8 bits
	 * @returns {BinaryValue[]}
	 */
	getBytes(): BinaryValue[] {
		const bytes = []
		for (let i = 1; i <= this.bytes(); i++) {
			bytes.push(this.getByte(i))
		}
		return bytes
	}

	/**
	 * Returns true if the bit at the specified position is set to 1, otherwise returns false
	 * @param {number} pos - The index of the bit that should be checked.
	 * Can either be a positive value from 1 to this.bits() or a negative value from -1 to -this.bits().
	 * A negative value starts from the least significant bit while a positive value starts from the most significant bit
	 * @returns {boolean}
	 */
	isBitSet(pos: number): boolean {
		return this.value.charAt(positionToIndex(pos, this.bits())) === "1"
	}

	/**
	 * Returns a new instance with the same value of its instance, but with the bit of the specified position setted to the specified value
	 * @param {number} pos - The index of the bit that should be setted.
	 * Can either be a positive value from 1 to this.bits() or a negative value from -1 to -this.bits().
	 * A negative value starts from the least significant bit while a positive value starts from the most significant bit
	 * @param {boolean} value - The value of the bit: true for 1 and false for 0
	 * @returns {BinaryValue}
	 */
	setBit(pos: number, value: boolean): BinaryValue {
		return new BinaryValue(this.bits(), setBit(this.value, pos, value))
	}

	/**
	 * Returns a new instances of BinaryValue creating it from the provided bytes
	 * @static
	 * @param {number[]|string[]|BinaryValue[]} bytes - The bytes from which the new instance will be created.
	 * The first element of the array will be the most significant byte, while the last will be the least significant
	 * @returns {BinaryValue}
	 */
	static fromBytes(bytes: number[] | string[] | BinaryValue[]): BinaryValue {
		checkValidBitCount(bytes.length * 8)
		if (typeof bytes[0] === "number") {
			return BinaryValue.fromBytes(bytes.map(b => new BinaryValue(8, b)))
		} else if (typeof bytes[0] === "string") {
			return new BinaryValue((bytes.length * 8) as BinaryValueSize, bytes.join(""))
		} else {
			return new BinaryValue(
				(bytes.length * 8) as BinaryValueSize,
				bytes.map(b => b.toBinaryString()).join("")
			)
		}
	}
}
