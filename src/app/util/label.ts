export const MIN_LABEL_LENGTH = 1
export const MAX_LABEL_LENGTH = 10
export const ALLOWED_CHARS = /[A-Z_]/
export const VALID_LABEL_PATTERN = new RegExp(
	`^${ALLOWED_CHARS.source}{${MIN_LABEL_LENGTH},${MAX_LABEL_LENGTH}}$`
)

export function isValidLabel(label: string): boolean {
	return VALID_LABEL_PATTERN.test(label)
}
