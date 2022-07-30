import { get } from "svelte/store"
import { availableTtsVoices, ttsSpeed, ttsVoice } from "../store/settings"

let utterance: SpeechSynthesisUtterance = null
let voice: SpeechSynthesisVoice

ttsVoice.subscribe(newVoice => (voice = get(availableTtsVoices).find(v => v.name === newVoice)))

function read(text: string, ...callbacks: (() => void)[]) {
	utterance = new SpeechSynthesisUtterance(text)
	utterance.rate = get(ttsSpeed)
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

export default {
	read,
	isUtteranceEnded
}
