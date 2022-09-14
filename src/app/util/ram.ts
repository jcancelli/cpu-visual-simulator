import { WORD_SIZE } from "./cpu"

/** First Ram address */
export const FIRST_ADDRESS = 0
/** Last Ram address */
export const LAST_ADDRESS = 254

/**
 * Converts a Ram address to and index (that starts from 0)
 * @param {number} address - The address that should be converted
 * @returns {number}
 */
export function addressToIndex(address: number): number {
	if (!isValidAddress(address)) {
		throw new Error("Invalid address: " + address)
	}
	return address / WORD_SIZE
}

/**
 * Converts an index (that starts from 0) to a Ram address
 * @param {number} index - The index that should be converted
 * @returns {number}
 */
export function indexToAddress(index: number): number {
	const address = index * WORD_SIZE
	if (!isValidAddress(address)) {
		throw new Error("Invalid index: " + index)
	}
	return address
}

/**
 * Returns true if the specified value is a valid address
 * @param {number} address - The address that should be checked
 * @returns {boolean}
 */
export function isValidAddress(address: number): boolean {
	return address % WORD_SIZE === 0 && address >= FIRST_ADDRESS && address <= LAST_ADDRESS
}
