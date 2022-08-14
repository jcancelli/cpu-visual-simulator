// takes an either positive or negative number and turns it into a valid index from 0 to length-1
// example: pos=-2 length=9 returns=6
export function positionToIndex(pos: number, length: number): number {
	if (Math.abs(pos) > length) {
		throw new Error(`Position ${pos} out of range +/-${length}`)
	}
	if (pos === 0) {
		throw new Error("Positions start from 1")
	}
	return pos < 0 ? this.value.length + pos : pos - 1
}
