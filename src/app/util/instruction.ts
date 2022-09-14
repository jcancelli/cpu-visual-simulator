import BinaryValue from "../model/BinaryValue"

export const IMMEDIATE_FLAG_POS = 1 // the most significant bit

export function isImmediateFlagSet(value: BinaryValue): boolean {
	return value.isBitSet(IMMEDIATE_FLAG_POS)
}

export function setImmediateFlag(value: BinaryValue, flagValue: boolean): BinaryValue {
	return value.setBit(IMMEDIATE_FLAG_POS, flagValue)
}

export function removeFlags(value: BinaryValue): BinaryValue {
	return setImmediateFlag(value, false)
}
