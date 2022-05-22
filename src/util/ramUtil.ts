export const FIRST_ADDRESS = 0
export const LAST_ADDRESS = 254
export const WORD_SIZE = 2

export function addressToIndex(address: number): number {
	if (!isValidAddress(address)) {
		throw new Error("Invalid address: " + address)
	}
	return address / WORD_SIZE
}

export function indexToAddress(index: number): number {
	const address = index * WORD_SIZE
	if (!isValidAddress(address)) {
		throw new Error("Invalid index: " + index)
	}
	return address
}

export function isValidAddress(address: number): boolean {
	return address % WORD_SIZE === 0 && address >= FIRST_ADDRESS && address <= LAST_ADDRESS
}
