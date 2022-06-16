import { get } from "svelte/store"
import { playAnimations, textToSpeech } from "../../store/settings"
import { Cache } from "../execution"

export type Condition = (cache: Cache) => boolean

export function ZERO_FLAG_SET(cache: Cache): boolean {
	return cache["SW:Z"]
}

export function ZERO_FLAG_NOT_SET(cache: Cache): boolean {
	return !cache["SW:Z"]
}

export function NEGATIVE_FLAG_SET(cache: Cache): boolean {
	return cache["SW:N"]
}

export function NEGATIVE_FLAG_NOT_SET(cache: Cache): boolean {
	return !cache["SW:N"]
}

export function IS_ANIMATING(cache: Cache): boolean {
	return get(playAnimations)
}

export function TTS_ENABLED(cache: Cache): boolean {
	return get(textToSpeech)
}
