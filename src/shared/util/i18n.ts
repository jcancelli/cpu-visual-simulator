export const SUPPORTED_LANGUAGES = ["en", "it"] as const
export const DEFAULT_LANGUAGE = "en"
export type Language = typeof SUPPORTED_LANGUAGES[number]

export function getDefaultLanguage(): Language {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGUAGES.includes(lang as Language) ? (lang as Language) : DEFAULT_LANGUAGE
}
