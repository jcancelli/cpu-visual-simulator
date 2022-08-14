export const SUPPORTED_LANGS = ["en", "it"] as const
export const DEFAULT_LANG = "en"
export type Language = typeof SUPPORTED_LANGS[number]

export function getDefaultLanguage(): Language {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGS.includes(lang as Language) ? (lang as Language) : DEFAULT_LANG
}
