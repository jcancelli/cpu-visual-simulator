import { InvalidAddressingModeError } from "$lib/errors/cpu"

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
