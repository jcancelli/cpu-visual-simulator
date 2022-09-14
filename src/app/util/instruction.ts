import BinaryValue from "../model/BinaryValue"
import { IMMEDIATE_FLAG_POS } from "../instruction/Opcode"

export function isImmediateFlagSet(value: BinaryValue): boolean {
	return value.isBitSet(IMMEDIATE_FLAG_POS)
}

export function setImmediateFlag(value: BinaryValue, flagValue: boolean): BinaryValue {
	return value.setBit(IMMEDIATE_FLAG_POS, flagValue)
}

export function removeFlags(value: BinaryValue): BinaryValue {
	return setImmediateFlag(value, false)
}
