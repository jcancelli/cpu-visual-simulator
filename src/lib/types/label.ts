import { unreachable } from "$lib/util/development"
import { CHAR_CODE_UNDERSCORE, isUppercaseLetter } from "$lib/util/text"

/** Maximum length for a valid label */
export const LABEL_MAX_LENGTH = 10

/** Check if the character represented by the provided char code is a valid label character */
export function isValidLabelCharacter(charCode: number): boolean {
	return isUppercaseLetter(charCode) || charCode === CHAR_CODE_UNDERSCORE
}

/** A valid memory address label */
export type Label = string & { __validLabel: true }

/** Result of a label validation */
export enum LabelValidationResult {
	/** The label is valid */
	VALID,
	/** The label is longer than {@link LABEL_MAX_LENGTH} */
	TOO_LONG,
	/** The label is an empty string */
	EMPTY,
	/** The label contains an invalid character */
	FORBIDDEN_CHARACTER,
}

/** Failure of a label validation */
export type LabelValidationFail = Exclude<LabelValidationResult, LabelValidationResult.VALID>

/** Check if the provided string contains a valid label between startIndex (inclusive) and endIndex (not inclusive).
 * @returns
 * - {@link LabelValidationResult.TOO_LONG} if the label is longer than {@link LABEL_MAX_LENGTH}
 * - {@link LabelValidationResult.EMPTY} if the label length === 0
 * - {@link LabelValidationResult.FORBIDDEN_CHARACTER} if the label contains a character that is not allowed in a label
 * - {@link LabelValidationResult.VALID} if the label is valid */
export function validateLabel(
	str: string,
	startIndex: number = 0,
	endIndex: number = str.length,
): LabelValidationResult {
	if (startIndex > endIndex || endIndex > str.length) {
		unreachable(
			`Invalid indices for string of length ${str.length}. Start index: ${startIndex}, end index: ${endIndex}`,
		)
	}
	const length = endIndex - startIndex
	if (length > LABEL_MAX_LENGTH) {
		return LabelValidationResult.TOO_LONG
	}
	if (length === 0) {
		return LabelValidationResult.EMPTY
	}
	for (let i = startIndex; i < endIndex; i += 1) {
		const charCode = str.charCodeAt(i)
		if (!isValidLabelCharacter(charCode)) {
			return LabelValidationResult.FORBIDDEN_CHARACTER
		}
	}
	return LabelValidationResult.VALID
}

/** Assert that the provided string is a valid {@link Label}.
 * @throws {InvalidLabelError} */
export function assertValidLabel(label: string): asserts label is Label {
	const result = validateLabel(label)
	if (result !== LabelValidationResult.VALID) {
		throw new InvalidLabelError(label, result)
	}
}
