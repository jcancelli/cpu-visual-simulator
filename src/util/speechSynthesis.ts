import { get } from "svelte/store"
import {
	availableTextToSpeechVoices,
	textToSpeechSpeed,
	textToSpeechVoice
} from "../store/settings"

let utterance: SpeechSynthesisUtterance = null
let voice: SpeechSynthesisVoice

textToSpeechVoice.subscribe(
	newVoice => (voice = get(availableTextToSpeechVoices).find(v => v.name === newVoice))
)

function read(text: string, ...callbacks: (() => void)[]) {
	utterance = new SpeechSynthesisUtterance(text)
	utterance.rate = get(textToSpeechSpeed)
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
