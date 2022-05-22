export function isValidBinary8bit(bin: string): boolean {
	return /^[01]{1,8}$/.test(bin)
}

export function isValidUnsigned8bit(num: number): boolean {
	return num < 256 && num >= 0
}

export function isValidSigned8bit(num: number): boolean {
	return num < 128 && num >= -128
}

export function unsignedToBinary8bit(num: number): string {
	if (!isValidUnsigned8bit(num)) {
		throw new Error("Invalid 8 bit unsigned value: " + num)
	}
	return pad((num >>> 0).toString(2))
}

export function signedToBinary8bit(num: number): string {
	if (!isValidSigned8bit(num)) {
		throw new Error("Invalid 8 bit signed value: " + num)
	}
	return pad(signedToBinaryString(num))
}

export function binaryToUnsigned8bit(bin: string): number {
	if (!isValidBinary8bit(bin)) {
		throw new Error('Invalid binary value: "' + bin + '"')
	}
	return parseInt(bin, 2)
}

export function binaryToSigned8bit(bin: string): number {
	if (!isValidBinary8bit(bin)) {
		throw new Error('Invalid binary value: "' + bin + '"')
	}
	if (bin.length < 8 || bin.startsWith("0")) {
		bin = ("00000000000000000000000000000000" + bin).slice(-32)
	} else {
		bin = ("11111111111111111111111111111111" + bin).slice(-32)
	}
	return ~~parseInt(bin, 2)
}

export function unsignedToSigned(num: number): number {
	return binaryToSigned8bit(unsignedToBinary8bit(num))
}

export function signedToBinaryString(num: number) {
	return (num >>> 0).toString(2)
}

// bitPos: index of the bit starting from 0 and from the least significant bit
export function setBit(binString: string, bitPos: number, value: boolean): string {
	if (!/^[10]*$/.test(binString)) {
		throw new Error("Invalid binary string")
	}
	if (bitPos < 0 || bitPos > binString.length) {
		throw new Error("Invalid bit position")
	}
	let bits = binString.split("")
	bits[binString.length - bitPos - 1] = value ? "1" : "0"
	return bits.join("")
}

export function pad(bin: string) {
	return ("00000000" + bin).slice(-8)
}

export function handleOverflowUnderflow(num: number) {
	return binaryToSigned8bit(pad(signedToBinaryString(num)))
}
