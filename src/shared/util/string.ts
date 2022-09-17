/**
 * Takes either a positive or a negative number and turns it into a valid index from 0 to length-1
 * @param {number} pos - The position that should be converted
 * @param {number} length - The value that the index should be < of
 * @example positionToIndex(-2, 9) === 6
 */
export function positionToIndex(pos: number, length: number): number {
	if (Math.abs(pos) > length) {
		throw new Error(`Position ${pos} out of range +/-${length}`)
	}
	if (pos === 0) {
		throw new Error("Positions start from 1")
	}
	return pos < 0 ? this.value.length + pos : pos - 1
}

/**
 * If the length of the passed string is greater than maxLength, returns the string shortened to the maxLength length and with "..." appended to it.
 * Otherwise returns the string untouched
 * @param {string} value - The string
 * @param {number} maxLength - The maximum length of the string
 */
export function shorten(value: string, maxLength: number): string {
	if (value.length > maxLength) {
		return value.substring(0, maxLength).concat("...")
	} else {
		return value
	}
}
