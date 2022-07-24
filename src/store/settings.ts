import { writable } from "svelte/store"

export const SUPPORTED_LANGS = ["en", "it"] as const
export type SupportedLang = typeof SUPPORTED_LANGS[number]
export const DEFAULT_LANG = "en"

export const showSettings = writable(false)
export const displayAsBinary = writable(false)
export const displayLabels = writable(true)
export const playAnimations = writable(true)
export const animationSpeed = writable(1.6)
export const language = writable(getDefaultLanguage())
export const textToSpeech = writable(false)

export function getDefaultLanguage(): SupportedLang {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : DEFAULT_LANG
}
