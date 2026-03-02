import { SingleElementFlashAnimation, type FlashableID } from "./animation"

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

/** Keyframe effect options for the flashed animation.
 * Stored in a constant to avoid recreating the same object over and over. */
const registerFlashAnimationOpts = {
	duration: 500,
	iterations: 2,
	direction: "alternate",
} as const satisfies KeyframeEffectOptions
