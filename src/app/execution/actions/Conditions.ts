import { get } from "svelte/store"
import cpu from "../../store/cpu"
import { minimalAnimations, ttsEnabled } from "../../store/settings"

export type Condition = () => boolean

export function ZERO_FLAG_SET(): boolean {
	return get(cpu.zeroFlag)
}

export function NEGATIVE_FLAG_SET(): boolean {
	return get(cpu.negativeFlag)
}

export function MINIMAL_ANIMATIONS(): boolean {
	return get(minimalAnimations)
}

export function TTS_ENABLED(): boolean {
	return get(ttsEnabled)
}

export function NOT(condition: Condition): Condition {
	return () => !condition()
}

export function AND(conditionA: Condition, conditionB: Condition): Condition {
	return () => conditionA() && conditionB()
}

export function OR(conditionA: Condition, conditionB: Condition): Condition {
	return () => conditionA() || conditionB()
}
