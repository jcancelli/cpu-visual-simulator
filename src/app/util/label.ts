import { interpolate } from "../../shared/util/template"
import InvalidLabelError from "../errors/InvalidLabelError"
import text from "../store/text"

/** The minimum length of a valid label */
export const MIN_LABEL_LENGTH = 1
/** The maximum length of a valid label */
export const MAX_LABEL_LENGTH = 10
/** A regexp that describes all the characters allowed in a label */
export const ALLOWED_CHARS = /[A-Z_]/
/** A regexp that describes all the characters not allowed in a label */
export const NOT_ALLOWED_CHARS = /[^A-Z_]/
/** A regexp that describes the pattern of a valid label */
export const VALID_LABEL_PATTERN = new RegExp(
	`^${ALLOWED_CHARS.source}{${MIN_LABEL_LENGTH},${MAX_LABEL_LENGTH}}$`
)

/**
 * Returns true if the specified string matches a valid label pattern, otherwise false
 * @param {string} label - The string that should be evaluated
 * @returns Returns true if the specified string matches a valid label pattern, otherwise false
 */
export function isValidLabel(label: string): boolean {
	return VALID_LABEL_PATTERN.test(label)
}

/**
 * Validates the label. Throws an error if the label is invalid otherwise returns the label
 * @param {string} label - The label that should be validated
 */
export function validateLabel(label: string): string {
	if (NOT_ALLOWED_CHARS.test(label)) {
		throw new InvalidLabelError(
			interpolate(text.get().errors.label_parsing.invalid_character, label.match(NOT_ALLOWED_CHARS)[0]),
			label
		)
	}
	if (label.length > MAX_LABEL_LENGTH) {
		throw new InvalidLabelError(
			interpolate(text.get().errors.label_parsing.label_too_long, MAX_LABEL_LENGTH),
			label
		)
	}
	if (label.length < MIN_LABEL_LENGTH) {
		throw new InvalidLabelError(
			interpolate(text.get().errors.label_parsing.label_too_short, MIN_LABEL_LENGTH),
			label
		)
	}
	return label
}
