import { get } from "svelte/store"
import { language as selectedLanguage, SupportedLang } from "../store/settings"

let utterance: SpeechSynthesisUtterance = null
let language = get(selectedLanguage)

init()

function read(text: string, callback: () => void = null) {
	utterance = new SpeechSynthesisUtterance(text)
	utterance.rate = 1.2
	utterance.lang = language
	utterance.onend = utterance.onerror = () => {
		onUtteranceEnded()
		callback?.()
	}
	speechSynthesis.speak(utterance)
}

function endedReading() {
	return utterance === null
}

function init() {
	selectedLanguage.subscribe(onLanguageChanged)
}

function onUtteranceEnded() {
	utterance = null
}

function onLanguageChanged(lang: SupportedLang) {
	language = lang
	if (utterance !== null) {
		utterance.lang = language
	}
}

export default {
	read,
	endedReading
}
