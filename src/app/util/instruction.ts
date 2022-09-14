import BinaryValue from "../model/BinaryValue"

/** Position of the bit of the immediate flag in a binary value
 * (in a value of n bits, 1 == most significant bit, n == least significant bit)
 **/
export const IMMEDIATE_FLAG_POS = 1

/**
 * Returns wether a binary value has the immediate flag set
 * @param {BinaryValue} value - The binary value that should be checked
 * @returns {boolean}
 */
export function isImmediateFlagSet(value: BinaryValue): boolean {
	return value.isBitSet(IMMEDIATE_FLAG_POS)
}

/**
 * Returns a new BinaryValue instance with the same value as the specified binary value but with the immediate flag value set to the specified value
 * @param {BinaryValue} value - The binary value where the immediate flag should be set
 * @param {boolean} flagValue - The value of the flag: true for 1, false for 0
 * @returns {BinaryValue}
 */
export function setImmediateFlag(value: BinaryValue, flagValue: boolean): BinaryValue {
	return value.setBit(IMMEDIATE_FLAG_POS, flagValue)
}

/**
 * Returns a new BinaryValue instance with all the flags set to false
 * @param {BinaryValue} value - The binary value where the flag should be removed
 * @returns {BinaryValue}
 */
export function removeFlags(value: BinaryValue): BinaryValue {
	return setImmediateFlag(value, false)
}
