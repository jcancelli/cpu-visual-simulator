import { EMPTY_FUNC, unreachable } from "$lib/util/development"

/** An element that can perform a flash animation */
export interface Flashable {
	/** @returns The ID of this element */
	getFlashableID(): FlashableID
	/** @returns A new instance of a flash animation */
	createFlashAnimation(): FlashAnimation
	/** @returns All of the subelements associated with this element */
	getFlashableSubelements(): Flashable[]
}

/** ID of a {@link Flashable} element */
export type FlashableID = string

/** Subset of {@link Animation} relevant for a flasah animation */
export interface FlashAnimation {
	get finished(): Promise<void>
	get id(): string
	get playState(): AnimationPlayState
	get playbackRate(): number
	set playbackRate(value: number)
	play(): void
	pause(): void
	cancel(): void
	updatePlaybackRate(rate: number): void
}

/** Parameters for the creation of a {@link SingleElementFlashAnimation} */
export interface SingleElementFlashAnimationParams {
	/** ID of the element */
	flashableElementId: FlashableID
	/** The animated element */
	element: HTMLElement
	/** Keyframes for the animation */
	keyframes: Keyframe[] | PropertyIndexedKeyframes
	/** Options for the keyframes */
	options: KeyframeEffectOptions
}

/** Implementation of {@link FlashAnimation} that animates a single html element */
export class SingleElementFlashAnimation implements FlashAnimation {
	/** The actual animation wrapped by this instance */
	private readonly animation: Animation

	constructor(params: SingleElementFlashAnimationParams) {
		this.animation = new Animation(
			new KeyframeEffect(params.element, params.keyframes, params.options),
		)
		this.animation.id = `${params.flashableElementId}-flash-animation`
	}

	get finished(): Promise<void> {
		return this.animation.finished.then(EMPTY_FUNC, EMPTY_FUNC)
	}

	get id(): string {
		return this.animation.id
	}

	get playState(): AnimationPlayState {
		return this.animation.playState
	}

	get playbackRate(): number {
		return this.animation.playbackRate
	}

	set playbackRate(value: number) {
		this.animation.playbackRate = value
	}

	play(): void {
		this.animation.play()
	}

	pause(): void {
		this.animation.pause()
	}

	cancel(): void {
		this.animation.cancel()
	}

	updatePlaybackRate(rate: number): void {
		this.animation.updatePlaybackRate(rate)
	}
}

/** Parameters for the creation of a {@link MultipleElementsFlashAnimation} */
export interface MultipleElementsFlashAnimationParams {
	/** ID of the {@link Flashable} element associated with this animation */
	flashableElementId: FlashableID
	/** Animations that compose this animation */
	subanimations: {
		/** The animated element */
		element: HTMLElement
		/** Keyframes for the sub-animation */
		keyframes: Keyframe[] | PropertyIndexedKeyframes
	}[]
	/** Options for the keyframes of all sub-animations */
	options: KeyframeEffectOptions
}

/** Implementation of {@link FlashAnimation} that animates a multiple html elements at the same time */
export class MultipleElementsFlashAnimation implements FlashAnimation {
	/** The ID of this animation */
	public readonly id: string
	/** The subanimations that compose this animation */
	private readonly subAnimations: FlashAnimation[]

	constructor(params: MultipleElementsFlashAnimationParams) {
		if (params.subanimations.length === 0) {
			unreachable(
				`At least one animation needed for MultipleElementsFlashAnimation with id "${params.flashableElementId}"`,
			)
		}
		this.id = `${params.flashableElementId}-flash-animation`
		this.subAnimations = []
		let i = 0
		for (const subanimation of params.subanimations) {
			this.subAnimations.push(
				new SingleElementFlashAnimation({
					flashableElementId: `${params.flashableElementId}-subelement-${i}`,
					element: subanimation.element,
					keyframes: subanimation.keyframes,
					options: params.options,
				}),
			)
			i += 1
		}
	}

	get finished(): Promise<void> {
		return Promise.allSettled(this.subAnimations.map(animation => animation.finished)).then(
			EMPTY_FUNC,
		)
	}

	get playState(): AnimationPlayState {
		return this.subAnimations[0].playState
	}

	get playbackRate(): number {
		return this.subAnimations[0].playbackRate
	}

	set playbackRate(value: number) {
		for (const animation of this.subAnimations) {
			animation.playbackRate = value
		}
	}

	play(): void {
		for (const animation of this.subAnimations) {
			animation.play()
		}
	}

	pause(): void {
		for (const animation of this.subAnimations) {
			animation.pause()
		}
	}

	cancel(): void {
		for (const animation of this.subAnimations) {
			animation.cancel()
		}
	}

	updatePlaybackRate(rate: number): void {
		for (const animation of this.subAnimations) {
			animation.updatePlaybackRate(rate)
		}
	}
}
