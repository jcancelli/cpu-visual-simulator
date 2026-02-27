import { InvalidStatusWordError } from "$lib/errors/cpu"
import type { U8 } from "./integer"

/** The bit of the status word zero flag */
export const ZERO_FLAG_BIT = (1 << 7) as StatusWord
/** All the bits of the status word except the zero flag set to 1 */
export const ZERO_FLAG_MASK = ~ZERO_FLAG_BIT >>> 0
/** The bit of the status word negative flag */
export const NEGATIVE_FLAG_BIT = (1 << 6) as StatusWord
/** All the bits of the status word except the negative flag set to 1 */
export const NEGATIVE_FLAG_MASK = ~NEGATIVE_FLAG_BIT >>> 0
/** All the bits of the status word set to 0 except the ones used for flags */
export const STATUS_WORD_ALL_FLAGS = ZERO_FLAG_BIT | (NEGATIVE_FLAG_BIT as StatusWord)
/** Status word with all flags set to 0 */
export const STATUS_WORD_NO_FLAGS = 0 as StatusWord

/** A byte that stores the zero flag and negative flag */
export type StatusWord = U8 & { __statusWord: true }

/** Check if the provided value is a valid status word value */
export function isStatusWord(value: number): value is StatusWord {
	return (value & STATUS_WORD_ALL_FLAGS) === value
}

/** Asserts that the provided value is a valid status word value.
 * @throws {InvalidStatusWordError} */
export function assertStatusWord(value: number): asserts value is StatusWord {
	if (!isStatusWord(value)) {
		throw new InvalidStatusWordError(value)
	}
}

/** @returns The provided status word with the zero flag bit set to 1.
 * No validation is performed on the input. */
export function withZeroFlag(value: StatusWord = 0 as StatusWord): StatusWord {
	return (value | ZERO_FLAG_BIT) as StatusWord
}

/** @returns The provided status word with the zero flag bit set to 0.
 * No validation is performed on the input. */
export function withoutZeroFlag(value: StatusWord = 0 as StatusWord): StatusWord {
	return (value & ZERO_FLAG_MASK) as StatusWord
}

/** @returns The state of the zero flag bit in the provided value.
 * No validation is performed on the input. */
export function getZeroFlag(value: StatusWord): boolean {
	return (value & ZERO_FLAG_BIT) === ZERO_FLAG_BIT
}

/** @returns The provided status word with the zero flag bit set to either 1 or 0.
 * No validation is performed on the input. */
export function setZeroFlag(value: StatusWord, flag: boolean): StatusWord {
	return flag ? withZeroFlag(value) : withoutZeroFlag(value)
}

/** @returns The provided status word with the negative flag bit set to 1.
 * No validation is performed on the input. */
export function withNegativeFlag(value: StatusWord = 0 as StatusWord): StatusWord {
	return (value | NEGATIVE_FLAG_BIT) as StatusWord
}

/** @returns The provided status word with the negative flag bit set to 0.
 * No validation is performed on the input. */
export function withoutNegativeFlag(value: StatusWord = 0 as StatusWord): StatusWord {
	return (value & NEGATIVE_FLAG_MASK) as StatusWord
}

/** @returns The state of the negative flag bit in the provided value.
 * No validation is performed on the input. */
export function getNegativeFlag(value: StatusWord): boolean {
	return (value & NEGATIVE_FLAG_BIT) === NEGATIVE_FLAG_BIT
}

/** @returns The provided status word with the negative flag bit set to either 1 or 0.
 * No validation is performed on the input. */
export function setNegativeFlag(value: StatusWord, flag: boolean): StatusWord {
	return flag ? withNegativeFlag(value) : withoutNegativeFlag(value)
}

/** Encode the provided flags into a status word */
export function encodeStatusWord(
	zeroFlag: boolean = true,
	negativeFlag: boolean = false,
): StatusWord {
	return setNegativeFlag(setZeroFlag(0 as StatusWord, zeroFlag), negativeFlag)
}
