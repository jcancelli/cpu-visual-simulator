import { get, writable } from "svelte/store"
import { isSet, bool, lang, num, set, str } from "../util/localStorage"

export const SUPPORTED_LANGS = ["en", "it"] as const
export type SupportedLang = typeof SUPPORTED_LANGS[number]
export const DEFAULT_LANG = "en"

export const showSettings = writable<boolean>(isSet("showSettings") ? bool("showSettings") : false)
export const displayAsBinary = writable<boolean>(isSet("displayAsBinary") ? bool("displayAsBinary") : false)
export const displayLabels = writable<boolean>(isSet("displayLabels") ? bool("displayLabels") : true)
export const playAnimations = writable<boolean>(isSet("playAnimations") ? bool("playAnimations") : true)
export const animationSpeed = writable<number>(isSet("animationSpeed") ? num("animationSpeed") : 1.6)
export const language = writable<SupportedLang>(isSet("language") ? lang("language") : getDefaultLanguage())
export const textToSpeechEnabled = writable<boolean>(
	isSet("textToSpeechEnabled") ? bool("textToSpeechEnabled") : false
)
export const textToSpeechSpeed = writable<number>(isSet("textToSpeechSpeed") ? num("textToSpeechSpeed") : 1)
export const textToSpeechVoice = writable<string>(isSet("textToSpeechVoice") ? str("textToSpeechVoice") : "")
export const availableTextToSpeechVoices = writable<SpeechSynthesisVoice[]>()

language.subscribe(newLang => availableTextToSpeechVoices.set(getAvailableVoices(newLang)))
availableTextToSpeechVoices.subscribe(newVoices => {
	if (isSet("textToSpeechVoice") && newVoices?.find(v => v.name === str("textToSpeechVoice"))) {
		textToSpeechVoice.set(str("textToSpeechVoice"))
	} else {
		textToSpeechVoice.set(newVoices[0]?.name || "")
	}
})

window.addEventListener("load", initSettings)

function initSettings() {
	availableTextToSpeechVoices.set(getAvailableVoices(get(language)))
	// subscribers so that each value is stored locally
	showSettings.subscribe(newValue => set("showSettings", newValue))
	displayAsBinary.subscribe(newValue => set("displayAsBinary", newValue))
	displayLabels.subscribe(newValue => set("displayLabels", newValue))
	playAnimations.subscribe(newValue => set("playAnimations", newValue))
	animationSpeed.subscribe(newValue => set("animationSpeed", newValue))
	language.subscribe(newValue => set("language", newValue))
	textToSpeechEnabled.subscribe(newValue => set("textToSpeechEnabled", newValue))
	textToSpeechSpeed.subscribe(newValue => set("textToSpeechSpeed", newValue))
	textToSpeechVoice.subscribe(newValue => set("textToSpeechVoice", newValue))
}

export function getDefaultLanguage(): SupportedLang {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : DEFAULT_LANG
}

export function getAvailableVoices(lang: string): SpeechSynthesisVoice[] {
	return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith(lang))
}
