import BinaryValueOutOfRange from "../errors/BinaryValueOutOfRange"
import CheckedError from "../errors/CheckedError"
import Instruction from "../instruction/Instruction"
import { parseBinary } from "../instruction/instructionParser"
import {
	checkValidBitCount,
	isValidBinary,
	pad,
	setBit,
	valueIsInRange,
	valueToBinary
} from "./binaryUtil"
import { positionToIndex } from "./stringUtil"

export type Bits = 8 | 16 | 32

export default class BinaryValue {
	protected readonly value: string

	constructor(bits: Bits, value: number | string | BinaryValue) {
		if (typeof value === "string") {
			if (!isValidBinary(value, bits)) {
				throw new BinaryValueOutOfRange(value, bits)
			}
			this.value = pad(value, bits)
		} else if (typeof value === "number") {
			if (!valueIsInRange(value, bits)) {
				throw new BinaryValueOutOfRange(value, bits)
			}
			this.value = valueToBinary(value, bits)
		} else {
			this.value = valueToBinary(value.signed(), bits) // TEST THIS
		}
	}

	signed(): number {
		if (this.value.startsWith("0")) {
			return parseInt(this.value, 2)
		} else {
			return ~~parseInt(("11111111111111111111111111111111" + this.value).slice(-32), 2)
		}
	}

	unsigned(): number {
		return parseInt(this.value, 2)
	}

	toBinaryString(): string {
		return this.value
	}

	toInstruction(): Instruction {
		try {
			return parseBinary(this.toBinaryString())
		} catch (error) {
			throw new CheckedError("Not a vali instruction")
		}
	}

	bits(): Bits {
		return this.value.length as Bits
	}

	bytes(): number {
		return this.bits() / 8
	}

	// pos can be either negative or positive, a negative pos start from the lsbyte
	// pos goes from 1 to this.bytes() or from -1 to -this.bytes()
	getByte(pos: number): BinaryValue {
		const index = positionToIndex(pos, this.bytes()) * 8
		return new BinaryValue(8, this.value.substring(index, index + 8))
	}

	getBytes(): BinaryValue[] {
		const bytes = []
		for (let i = 1; i <= this.bytes(); i++) {
			bytes.push(this.getByte(i))
		}
		return bytes
	}

	// pos can be either negative or positive, a negative pos start from the lsb
	// pos goes from 1 to this.bits() or from -1 to -this.bits()
	isBitSet(pos: number): boolean {
		return this.value.charAt(positionToIndex(pos, this.bits())) === "1"
	}

	// pos can be either negative or positive, a negative pos start from the lsb
	// pos goes from 1 to this.bits() or from -1 to -this.bits()
	setBit(pos: number, value: boolean): BinaryValue {
		return new BinaryValue(this.bits(), setBit(this.value, pos, value))
	}

	static fromBytesValues(bytes: number[] | string[] | BinaryValue[]): BinaryValue {
		checkValidBitCount(bytes.length * 8)
		if (typeof bytes[0] === "number") {
			return BinaryValue.fromBytesValues(bytes.map(b => new BinaryValue(8, b)))
		} else if (typeof bytes[0] === "string") {
			return new BinaryValue((bytes.length * 8) as Bits, bytes.join(""))
		} else {
			return new BinaryValue(
				(bytes.length * 8) as Bits,
				bytes.map(b => b.toBinaryString()).join("")
			)
		}
	}
}
