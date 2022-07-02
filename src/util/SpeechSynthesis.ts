import { get } from "svelte/store"
import lang from "../store/lang"
import { language as selectedLanguage } from "../store/settings"

let utterance: SpeechSynthesisUtterance = null

function read(text: string, callback: () => void = null) {
	utterance = new SpeechSynthesisUtterance(text)
	utterance.rate = 1.1
	utterance.voice = getVoice()
	utterance.onend = utterance.onerror = () => {
		onUtteranceEnded()
		callback?.()
	}
	speechSynthesis.speak(utterance)
}

function getVoice(): SpeechSynthesisVoice {
	const prefered_voices_URIs = get(lang).tts.prefered_voices_URIs
	let voice = speechSynthesis.getVoices().find(v => v.voiceURI === prefered_voices_URIs[0])
	if (voice === undefined) {
		voice = speechSynthesis.getVoices().find(v => v.lang.startsWith(get(selectedLanguage)))
	}
	return voice
}

function endedReading() {
	return utterance === null
}

function onUtteranceEnded() {
	utterance = null
}

export default {
	read,
	endedReading
}
