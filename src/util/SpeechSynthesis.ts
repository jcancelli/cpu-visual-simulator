import { get } from "svelte/store"
import { SupportedLang } from "../resources/text"
import { animationSpeed, language as selectedLanguage } from "../store/settings"

let utterance: SpeechSynthesisUtterance = null
let rate = get(animationSpeed)
let language = get(selectedLanguage)

init()

function read(text: string) {
	utterance = new SpeechSynthesisUtterance(text)
	utterance.rate = rate
	utterance.lang = language
	utterance.onend = utterance.onerror = () => (utterance = null)
	speechSynthesis.speak(utterance)
}

function endedReading() {
	return utterance === null
}

function init() {
	animationSpeed.subscribe(onExecutionSpeedChanged)
	selectedLanguage.subscribe(onLanguageChanged)
}

function onExecutionSpeedChanged(animSpeed: number) {
	rate = animSpeed // this value should be scaled properly
	if (utterance !== null) {
		utterance.rate = rate
	}
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
