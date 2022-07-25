import { writable } from "svelte/store"

export const SUPPORTED_LANGS = ["en", "it"] as const
export type SupportedLang = typeof SUPPORTED_LANGS[number]
export const DEFAULT_LANG = "en"

export const showSettings = writable<boolean>(false)
export const displayAsBinary = writable<boolean>(false)
export const displayLabels = writable<boolean>(true)
export const playAnimations = writable<boolean>(true)
export const animationSpeed = writable<number>(1.6)
export const language = writable<SupportedLang>()
export const textToSpeechEnabled = writable<boolean>(false)
export const textToSpeechSpeed = writable<number>(1)
export const textToSpeechVoice = writable<string>()
export const availableTextToSpeechVoices = writable<SpeechSynthesisVoice[]>()

language.subscribe(newLang => availableTextToSpeechVoices.set(getAvailableVoices(newLang)))
availableTextToSpeechVoices.subscribe(newVoices => textToSpeechVoice.set(newVoices[0]?.name || ""))

window.addEventListener("load", initSettings)

function initSettings() {
	language.set(getDefaultLanguage())
}

export function getDefaultLanguage(): SupportedLang {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : DEFAULT_LANG
}

export function getAvailableVoices(lang: string): SpeechSynthesisVoice[] {
	return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith(lang))
}
