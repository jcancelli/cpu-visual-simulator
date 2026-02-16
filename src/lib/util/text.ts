export const CHAR_CODE_A = "A".charCodeAt(0)
export const CHAR_CODE_Z = "Z".charCodeAt(0)
export const CHAR_CODE_0 = "0".charCodeAt(0)
export const CHAR_CODE_9 = "9".charCodeAt(0)
export const CHAR_CODE_SPACE = " ".charCodeAt(0)
export const CHAR_CODE_MINUS = "-".charCodeAt(0)
export const CHAR_CODE_UNDERSCORE = "_".charCodeAt(0)
export const CHAR_CODE_HASHTAG = "#".charCodeAt(0)
export const CHAR_CODE_IMMEDIATE_FLAG = CHAR_CODE_HASHTAG

/** Check if the character represented by the provided character code is in the range [A-Z] */
export function isUppercaseLetter(charCode: number): boolean {
	return charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_Z
}

/** Check if the character represented by the provided character code is not in the range [A-Z] */
export function isNotUppercaseLetter(charCode: number): boolean {
	return charCode < CHAR_CODE_A || charCode > CHAR_CODE_Z
}

/** Check if the character represented by the provided character code is in the range [0-9] */
export function isNumber(charCode: number): boolean {
	return charCode >= CHAR_CODE_0 && charCode <= CHAR_CODE_9
}

/** Check if the character represented by the provided character code is not in the range [0-9] */
export function isNotNumber(charCode: number): boolean {
	return charCode < CHAR_CODE_0 || charCode > CHAR_CODE_9
}
