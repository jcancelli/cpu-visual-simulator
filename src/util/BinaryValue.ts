import { isValidBinary, pad, setBit, valueIsInRange, valueToBinary } from "./binaryUtil"
import { positionToIndex } from "./stringUtil"

export type Bits = 8 | 16 | 32

export default class BinaryValue {
	protected readonly value: string

	constructor(bits: Bits, value: number | string | BinaryValue) {
		if (typeof value === "string") {
			if (!isValidBinary(value, bits)) {
				throw new Error(`Invalid ${bits}-bit binary value`)
			}
			this.value = pad(value, bits)
		} else if (typeof value === "number") {
			if (!valueIsInRange(value, bits)) {
				throw new Error(`Invalid ${bits}-bit value`)
			}
			this.value = valueToBinary(value, bits)
		} else {
			this.value = valueToBinary(value.signedValue(), bits) // TEST THIS
		}
	}

	signedValue(): number {
		return ~~parseInt(this.value, 2) // to test, in the old implementation, if the msb was 1, it was padded with "1"s to 32 bits
	}

	// export function signedValue(): number {
	// 	let bin = this.value
	// 	if (bin.startsWith("0")) {
	// 		bin = ("00000000000000000000000000000000" + bin).slice(-32)
	// 	} else {
	// 		bin = ("11111111111111111111111111111111" + bin).slice(-32)
	// 	}
	// 	return ~~parseInt(bin, 2)
	// }

	unsignedValue(): number {
		return parseInt(this.value, 2)
	}

	toBinaryString(): string {
		return this.value
	}

	bits(): Bits {
		return this.value.length as Bits
	}

	bytes(): number {
		return this.bits() / 8
	}

	getByte(pos: number): BinaryValue {
		const index = positionToIndex(pos, this.bytes())
		return new BinaryValue(8, this.value.substring(index, index + 8))
	}

	// pos can be either negative or positive, a negative pos start from the lsb
	// pos goes from 1 to this.bits or from -1 to -this.bits
	isBitSet(pos: number): boolean {
		return this.value.charAt(positionToIndex(pos, this.bits())) === "1"
	}

	// pos can be either negative or positive, a negative pos start from the lsb
	// pos goes from 1 to this.bits or from -1 to -this.bits
	setBit(pos: number, value: boolean): BinaryValue {
		return new BinaryValue(this.bits(), setBit(this.value, pos, value))
	}
}
