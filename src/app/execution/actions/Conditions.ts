import { get } from "svelte/store"
import { cpuStore } from "../../store/state"
import { minimalAnimations, ttsEnabled } from "../../store/settings"

export type Condition = () => boolean

export function ZERO_FLAG_SET(): boolean {
	return cpuStore.get().zeroFlag.get()
}

export function NEGATIVE_FLAG_SET(): boolean {
	return cpuStore.get().negativeFlag.get()
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
