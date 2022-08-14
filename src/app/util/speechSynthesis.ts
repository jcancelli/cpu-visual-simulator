import { Language } from "../../shared/util/i18n"

let utterance: SpeechSynthesisUtterance = null

function read(text: string, rate: number, voice: SpeechSynthesisVoice, ...callbacks: (() => void)[]) {
	utterance = new SpeechSynthesisUtterance(text)
	utterance.rate = rate
	utterance.voice = voice
	utterance.onend = utterance.onerror = () => {
		utterance = null
		callbacks.forEach(callback => callback?.())
	}
	speechSynthesis.speak(utterance)
}

function isUtteranceEnded() {
	return utterance === null
}

function getAvailableVoices(lang: Language): SpeechSynthesisVoice[] {
	return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith(lang))
}

export default {
	read,
	isUtteranceEnded,
	getAvailableVoices
}
