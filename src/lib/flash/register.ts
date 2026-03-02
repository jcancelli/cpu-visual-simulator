import {
	MultipleElementsFlashAnimation,
	SingleElementFlashAnimation,
	type FlashableID,
} from "./animation"

/** Parameters for the creation of a {@link RegisterFlashAnimation} */
export interface RegisterFlashAnimationParams {
	/** ID of the element associated to with the animation */
	flashableElementId: FlashableID
	/** The animated html element */
	element: HTMLElement
	/** The properties that should be animated */
	properties: {
		background?: boolean
		text?: boolean
		border?: boolean
		fill?: boolean
	}
}

/** Flash animation for a register element */
export class RegisterFlashAnimation extends SingleElementFlashAnimation {
	constructor(params: RegisterFlashAnimationParams) {
		const keyframes: PropertyIndexedKeyframes = {}
		if (params.properties.background) {
			keyframes.backgroundColor = "var(--color-flash-animation-background)"
		}
		if (params.properties.text) {
			keyframes.color = "var(--color-flash-animation-text)"
		}
		if (params.properties.border) {
			keyframes.borderColor = "var(--color-flash-animation-border)"
		}
		if (params.properties.fill) {
			keyframes.fill = "var(--color-flash-animation-background)"
		}
		super({
			flashableElementId: params.flashableElementId,
			element: params.element,
			keyframes,
			options: registerFlashAnimationOpts,
		})
	}
}

/** Parameters for the creation of an {@link InstructionRegisterFlashAnimation} */
export interface InstructionRegisterFlashAnimationParams {
	/** ID of the instruction register element associated with the animation */
	flashableElementId: FlashableID
	/** The animated html element of the instruction register */
	instructionRegisterElement: HTMLElement
	/** The animated html element of the opcode */
	opcodeElement: HTMLElement
	/** The animated html element of the operand */
	operandElement: HTMLElement
}

/** Flash animation for an instruction register element */
export class InstructionRegisterFlashAnimation extends MultipleElementsFlashAnimation {
	constructor(params: InstructionRegisterFlashAnimationParams) {
		super({
			flashableElementId: params.flashableElementId,
			subanimations: [
				{
					element: params.instructionRegisterElement,
					keyframes: {
						backgroundColor: "var(--color-flash-animation-background)",
						borderColor: "var(--color-flash-animation-border)",
					},
				},
				{
					element: params.opcodeElement,
					keyframes: {
						color: "var(--color-flash-animation-text)",
					},
				},
				{
					element: params.operandElement,
					keyframes: {
						color: "var(--color-flash-animation-text)",
					},
				},
			],
			options: registerFlashAnimationOpts,
		})
	}
}

/** Parameters for the creation of a {@link StatusWordFlashAnimation} */
export interface StatusWordFlashAnimationParams {
	/** ID of the status word element associated with the animation */
	flashableElementId: FlashableID
	/** The animated html element of the status word */
	statusWordElement: HTMLElement
	/** The animated html element of the zero flag */
	zeroFlagElement: HTMLElement
	/** The animated html element of the negative flag */
	negativeFlagElement: HTMLElement
	/** The animated html element of the unused bits */
	unusedBitsElement: HTMLElement
}

/** Flash animation for a status word element */
export class StatusWordFlashAnimation extends MultipleElementsFlashAnimation {
	constructor(params: StatusWordFlashAnimationParams) {
		super({
			flashableElementId: params.flashableElementId,
			subanimations: [
				{
					element: params.statusWordElement,
					keyframes: {
						backgroundColor: "var(--color-flash-animation-background)",
						borderColor: "var(--color-flash-animation-border)",
					},
				},
				{
					element: params.zeroFlagElement,
					keyframes: {
						color: "var(--color-flash-animation-text)",
						borderColor: "var(--color-flash-animation-border)",
					},
				},
				{
					element: params.negativeFlagElement,
					keyframes: {
						color: "var(--color-flash-animation-text)",
						borderColor: "var(--color-flash-animation-border)",
					},
				},
				{
					element: params.unusedBitsElement,
					keyframes: {
						color: "var(--color-flash-animation-text)",
						borderColor: "var(--color-flash-animation-border)",
					},
				},
			],
			options: registerFlashAnimationOpts,
		})
	}
}

/** Keyframe effect options for the flashed animation.
 * Stored in a constant to avoid recreating the same object over and over. */
const registerFlashAnimationOpts = {
	duration: 500,
	iterations: 2,
	direction: "alternate",
} as const satisfies KeyframeEffectOptions
