import { get, writable } from "svelte/store"
import { isSet, bool, lang, num, set, str } from "../util/localStorage"

export const SUPPORTED_LANGS = ["en", "it"] as const
export type SupportedLang = typeof SUPPORTED_LANGS[number]
export const DEFAULT_LANG = "en"

export const showSettings = writable<boolean>(isSet("showSettings") ? bool("showSettings") : false)
export const displayAsBinary = writable<boolean>(isSet("displayAsBinary") ? bool("displayAsBinary") : false)
export const displayLabels = writable<boolean>(isSet("displayLabels") ? bool("displayLabels") : true)
export const displayBussesLabels = writable<boolean>(
	isSet("displayBussesLabels") ? bool("displayBussesLabels") : true
)
export const displayStepText = writable<boolean>(isSet("displayStepText") ? bool("displayStepText") : false)
export const minimalAnimations = writable<boolean>(
	isSet("minimalAnimations") ? bool("minimalAnimations") : false
)
export const animationSpeed = writable<number>(isSet("animationSpeed") ? num("animationSpeed") : 1.6)
export const language = writable<SupportedLang>(isSet("language") ? lang("language") : getDefaultLanguage())
export const ttsEnabled = writable<boolean>(isSet("ttsEnabled") ? bool("ttsEnabled") : false)
export const ttsSpeed = writable<number>(isSet("ttsSpeed") ? num("ttsSpeed") : 1)
export const ttsVoice = writable<string>(isSet("ttsVoice") ? str("ttsVoice") : "")
export const availableTtsVoices = writable<SpeechSynthesisVoice[]>()

language.subscribe(newLang => availableTtsVoices.set(getAvailableVoices(newLang)))
availableTtsVoices.subscribe(newVoices => {
	if (isSet("ttsVoice") && newVoices?.find(v => v.name === str("ttsVoice"))) {
		ttsVoice.set(str("ttsVoice"))
	} else {
		ttsVoice.set(newVoices[0]?.name || "")
	}
})

window.addEventListener("load", initSettings)

function initSettings() {
	availableTtsVoices.set(getAvailableVoices(get(language)))
	// subscribers so that each value is stored locally
	showSettings.subscribe(newValue => set("showSettings", newValue))
	displayAsBinary.subscribe(newValue => set("displayAsBinary", newValue))
	displayLabels.subscribe(newValue => set("displayLabels", newValue))
	displayBussesLabels.subscribe(newValue => set("displayBussesLabels", newValue))
	displayStepText.subscribe(newValue => set("displayStepText", newValue))
	minimalAnimations.subscribe(newValue => set("minimalAnimations", newValue))
	animationSpeed.subscribe(newValue => set("animationSpeed", newValue))
	language.subscribe(newValue => set("language", newValue))
	ttsEnabled.subscribe(newValue => set("ttsEnabled", newValue))
	ttsSpeed.subscribe(newValue => set("ttsSpeed", newValue))
	ttsVoice.subscribe(newValue => set("ttsVoice", newValue))
}

export function getDefaultLanguage(): SupportedLang {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : DEFAULT_LANG
}

export function getAvailableVoices(lang: string): SpeechSynthesisVoice[] {
	return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith(lang))
}
