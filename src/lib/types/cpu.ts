import { InvalidAddressingModeError, InvalidStatusWordError } from "$lib/errors/cpu"

/** From which bus the operand should be read */
export enum Addressing {
	/** The operand is read from the data bus */
	DIRECT = 0b1,
	/** The operand is read from the bus connected to the instruction register operand */
	IMMEDIATE = 0b10,
}

/** Check if a given value is a valid {@link Addressing} value */
export function isValidAddressing(value: number): value is Addressing {
	return value === Addressing.IMMEDIATE || value === Addressing.DIRECT
}

/** Asserts that a given value is a valid {@link Addressing} value.
 * @throws {InvalidAddressingModeError} */
export function assertAddressing(value: number): asserts value is Addressing {
	if (!isValidAddressing(value)) {
		throw new InvalidAddressingModeError(value)
	}
}

/** The bit of the status word zero flag */
export const ZERO_FLAG_BIT = 1 << 7
/** All the bits of the status word except the zero flag set to 1 */
export const ZERO_FLAG_MASK = ~ZERO_FLAG_BIT >>> 0
/** The bit of the status word negative flag */
export const NEGATIVE_FLAG_BIT = 1 << 6
/** All the bits of the status word except the negative flag set to 1 */
export const NEGATIVE_FLAG_MASK = ~NEGATIVE_FLAG_BIT >>> 0
/** All the bits of the status word set to 0 except the ones used for flags */
export const ALL_FLAGS = ZERO_FLAG_BIT | NEGATIVE_FLAG_BIT

/** Check if the provided value is a valid status word value */
export function isValidStatusWord(value: number): boolean {
	return (value & ALL_FLAGS) === value
}

/** Asserts that the provided value is a valid status word value.
 * @throws {InvalidStatusWordError} */
export function assertValidStatusWord(value: number): void {
	if (!isValidStatusWord(value)) {
		throw new InvalidStatusWordError(value)
	}
}
