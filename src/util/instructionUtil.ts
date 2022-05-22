import { IMMEDIATE_FLAG, IMMEDIATE_FLAG_MASK } from "../instruction/Opcode"
import {
	binaryToSigned8bit,
	isValidBinary8bit,
	isValidSigned8bit,
	isValidUnsigned8bit,
	pad,
	setBit,
	signedToBinary8bit,
	unsignedToSigned
} from "../util/binaryUtil"

function flagIsSet(opcode: number | string, flag: number, flagIndex: number) {
	if (typeof opcode === "number") {
		return (opcode & flag) === flag
	} else if (typeof opcode === "string") {
		if (!isValidBinary8bit(opcode)) {
			throw new Error("Invalid 8 bit binary value")
		}
		return pad(opcode).charAt(flagIndex) === "1"
	} else {
		throw new Error("Invalid input type")
	}
}

function setFlag(
	input: number | string,
	flagValue: boolean,
	bitIndex: number,
	flag: number,
	mask: number
) {
	if (typeof input === "string") {
		if (!isValidBinary8bit(input)) {
			throw new Error("Invalid binary value")
		}
		return pad(setBit(input, bitIndex, flagValue))
	} else {
		if (!isValidSigned8bit(input) && !isValidUnsigned8bit(input)) {
			throw new Error("Input is not a valid 8 bit number")
		}
		if (isValidUnsigned8bit(input)) {
			return unsignedToSigned(flagValue ? input + flag : input & mask)
		} else {
			const binary = signedToBinary8bit(input)
			return binaryToSigned8bit(setFlag(binary, flagValue, bitIndex, flag, mask) as string)
		}
	}
}

export function immediateFlag(opcode: number | string): boolean {
	return flagIsSet(opcode, IMMEDIATE_FLAG, 0)
}

export function setImmediateFlag(input: number | string, flag: boolean): number | string {
	return setFlag(input, flag, 7, IMMEDIATE_FLAG, IMMEDIATE_FLAG_MASK)
}

export function removeFlags(input: number | string): number | string {
	return setImmediateFlag(input, false)
}
