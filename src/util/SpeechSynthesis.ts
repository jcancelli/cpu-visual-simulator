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
	const voices = speechSynthesis.getVoices()
	for (let voice_URI of prefered_voices_URIs) {
		let voice = voices.find(v => v.voiceURI === voice_URI)
		if (voice) {
			return voice
		}
	}
	return voices.find(v => v.lang.startsWith(get(selectedLanguage))) || voices.find(v => v.default)
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
