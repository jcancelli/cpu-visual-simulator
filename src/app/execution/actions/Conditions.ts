import { animationsEnabled, displayStepText, minimalAnimations, ttsEnabled } from "../../store/settings"
import { ExecutionContext } from "../ExecutionContext"

/** A function that takes an execution context and returns a boolean. Represents a condition for an action */
export type Condition = (ctx: ExecutionContext) => boolean

/** Returns true if the zero flag of the cpu passed in the execution context is set */
export function ZERO_FLAG_SET(ctx: ExecutionContext): boolean {
	return ctx.cpu.model.zeroFlag.get()
}

/** Returns true if the negative flag of the cpu passed in the execution context is set */
export function NEGATIVE_FLAG_SET(ctx: ExecutionContext): boolean {
	return ctx.cpu.model.negativeFlag.get()
}

/** Returns true if the animations enabled setting is set to true */
export function ANIMATIONS_ENABLED(ctx: ExecutionContext): boolean {
	return animationsEnabled.get()
}

/** Returns true if the minimal animations setting is set to true */
export function MINIMAL_ANIMATIONS(ctx: ExecutionContext): boolean {
	return minimalAnimations.get()
}

/** Returns true if the text to speech enabled setting is set to true */
export function TTS_ENABLED(ctx: ExecutionContext): boolean {
	return ttsEnabled.get()
}

/** Returns true if the step text component is showing */
export function STEP_TEXT_IS_SHOWING(ctx: ExecutionContext): boolean {
	return displayStepText.get()
}

/**
 * Takes a condition and returns a condition that represents the logical NOT of the input condition
 * @param condition - The condition that should be negated
 * @returns A condition that represents the logical NOT of the input condition
 */
export function NOT(condition: Condition): Condition {
	return (ctx: ExecutionContext) => !condition(ctx)
}

/**
 * Takes two conditions and returns a condition that represents the logical AND of the input conditions
 * @param conditionA - A condition
 * @param conditionB - Another condition
 * @returns A condition that represents the logical AND of the input conditions
 */
export function AND(conditionA: Condition, conditionB: Condition): Condition {
	return (ctx: ExecutionContext) => conditionA(ctx) && conditionB(ctx)
}

/**
 * Takes two conditions and returns a condition that represents the logical OR of the input conditions
 * @param conditionA - A condition
 * @param conditionB - Another condition
 * @returns A condition that represents the logical OR of the input conditions
 */
export function OR(conditionA: Condition, conditionB: Condition): Condition {
	return (ctx: ExecutionContext) => conditionA(ctx) || conditionB(ctx)
}
