import { get } from "svelte/store"
import { playAnimations, textToSpeech } from "../../store/settings"
import state from "../state"

export type Condition = () => boolean

export function ZERO_FLAG_SET(): boolean {
	return state["SW:Z"]
}

export function ZERO_FLAG_NOT_SET(): boolean {
	return !state["SW:Z"]
}

export function NEGATIVE_FLAG_SET(): boolean {
	return state["SW:N"]
}

export function NEGATIVE_FLAG_NOT_SET(): boolean {
	return !state["SW:N"]
}

export function IS_ANIMATING(): boolean {
	return get(playAnimations)
}

export function TTS_ENABLED(): boolean {
	return get(textToSpeech)
}
