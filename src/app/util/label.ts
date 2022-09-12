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
