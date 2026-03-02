/** Properties that should be animated by a flash animation */
export type FlashAnimationProperties = {
	background?: boolean
	text?: boolean
	border?: boolean
	fill?: boolean
}

/** Keyframe effect options for the flashed animation.
 * Stored in a constant to avoid recreating the same object over and over. */
const flashAnimationKeyframeEffectOpts = {
	duration: 500,
	iterations: 2,
	direction: "alternate",
} as const satisfies KeyframeEffectOptions

/** Creates a flash animation for an element */
export function makeFlashAnimation(
	element: HTMLElement,
	properties: FlashAnimationProperties,
): Animation {
	const keyframes: PropertyIndexedKeyframes = {}
	if (properties.background) {
		keyframes.backgroundColor = "var(--color-flash-animation-background)"
	}
	if (properties.text) {
		keyframes.color = "var(--color-flash-animation-text)"
	}
	if (properties.border) {
		keyframes.borderColor = "var(--color-flash-animation-border)"
	}
	if (properties.fill) {
		keyframes.fill = "var(--color-flash-animation-background)"
	}
	const keyframeEffect = new KeyframeEffect(element, keyframes, flashAnimationKeyframeEffectOpts)
	return new Animation(keyframeEffect)
}
