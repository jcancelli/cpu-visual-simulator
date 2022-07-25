import { get } from "svelte/store"
import cpu from "../../store/cpu"
import { playAnimations, textToSpeechEnabled } from "../../store/settings"

export type Condition = () => boolean

export function ZERO_FLAG_SET(): boolean {
	return get(cpu.zeroFlag)
}

export function ZERO_FLAG_NOT_SET(): boolean {
	return !get(cpu.zeroFlag)
}

export function NEGATIVE_FLAG_SET(): boolean {
	return get(cpu.negativeFlag)
}

export function NEGATIVE_FLAG_NOT_SET(): boolean {
	return !get(cpu.negativeFlag)
}

export function IS_ANIMATING(): boolean {
	return get(playAnimations)
}

export function TTS_ENABLED(): boolean {
	return get(textToSpeechEnabled)
}
