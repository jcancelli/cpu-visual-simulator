import { positionToIndex } from "../../shared/util/string"

export const MAX_BITS = 32 // js limit for bitwise operations
export const MIN_BITS = 1

export function checkValidBitCount(bits: number): void {
	if (bits < MIN_BITS || bits > MAX_BITS) {
		throw new Error(`Binary numbers must be between ${MIN_BITS} and ${MAX_BITS} bits`)
	}
}

export function isValidBinary(bin: string, bits: number): boolean {
	checkValidBitCount(bits)
	return new RegExp(`^[01]{1,${bits}}$`).test(bin)
}

// returns wether or not a value is a valid "bits"-bit value (signed or unsigned)
export function valueIsInRange(value: number, bits: number): boolean {
	return value <= maxValue(bits) && value >= minValue(bits)
}

export function isSigned(value: number, bits: number): boolean {
	return value <= maxSignedValue(bits) && value >= minValue(bits)
}

export function isUnsigned(value: number, bits: number): boolean {
	return value <= maxValue(bits) && value >= 0
}

export function maxValue(bits: number): number {
	checkValidBitCount(bits)
	return Math.pow(2, bits)
}

export function maxSignedValue(bits: number): number {
	checkValidBitCount(bits)
	return Math.pow(2, bits - 1) - 1
}

export function minValue(bits: number): number {
	checkValidBitCount(bits)
	return -Math.pow(2, bits - 1)
}

export function numberToBinaryString(value: number, bits: number) {
	checkValidBitCount(bits)
	return pad((value >>> 0).toString(2), bits)
}

export function pad(bin: string, bits: number) {
	return ("00000000000000000000000000000000" + bin).slice(-bits)
}

// pos can be either negative or positive, a negative pos start from the lsb
// pos goes from 1 to binString.length or from -1 to -binString.length
export function setBit(binString: string, pos: number, value: boolean): string {
	if (!/^[10]*$/.test(binString)) {
		throw new Error("Invalid binary string")
	}
	let bits = binString.split("")
	bits[positionToIndex(pos, binString.length)] = value ? "1" : "0"
	return bits.join("")
}
