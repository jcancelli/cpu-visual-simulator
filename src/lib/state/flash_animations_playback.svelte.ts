import { clamp } from "$lib/util/math"

/** Minimum value for a flash animation playback rate */
export const MIN_ANIMATION_RATE = 0.1
/** Maximum value for a flash animation playback rate */
export const MAX_ANIMATION_RATE = 3.0
/** Default value for a flash animation playback rate */
export const DEFAULT_ANIMATION_RATE = 1.0

/** An element that has a flash animation */
export interface FlashableElement {
	getFlashableID(): FlashableID
	createFlashAnimation(): Animation
	getFlashableSubelements(): FlashableElement[]
}

/** ID of a {@link FlashableElement} element */
export type FlashableID = string

/** Centralized handler for the playback of flash animation associated to {@link FlashableElement}*/
export class FlashAnimationsPlayback {
	/** The elements handled by this instance indexed by their ID */
	private elements: Map<FlashableID, FlashableElement>
	/** The animations handled by this instance indexed by their element ID */
	private animations: Map<FlashableID, Animation>
	/** The playback rate of the flash animations handled by this instance.
	 * The value is clamped between {@link MIN_ANIMATION_RATE} and {@link MAX_ANIMATION_RATE}. */
	private _playbackRate: number

	constructor() {
		/* eslint-disable-next-line svelte/prefer-svelte-reactivity -- Reactivity for this map is
		 * not only not needed but also damaging. Usually addElement is invoked inside a $effect when
		 * an html element with bind:this is mounted. If the map is reactive, this trigger an
		 * infinite recursive loop, throwing a Svelte error: effect_update_depth_exceeded. */
		this.elements = new Map()
		/* eslint-disable-next-line svelte/prefer-svelte-reactivity -- Reactivity for this map is
		 * not only not needed but also damaging. Usually addElement is invoked inside a $effect when
		 * an html element with bind:this is mounted. If the map is reactive, this trigger an
		 * infinite recursive loop, throwing a Svelte error: effect_update_depth_exceeded. */
		this.animations = new Map()
		this._playbackRate = $state(DEFAULT_ANIMATION_RATE)
	}

	/** The playback rate of the flash animations handled by this instance.
	 * The value is clamped between {@link MIN_ANIMATION_RATE} and {@link MAX_ANIMATION_RATE}. */
	get playbackRate(): number {
		return this._playbackRate
	}

	/** The playback rate of the flash animations handled by this instance.
	 * The value is clamped between {@link MIN_ANIMATION_RATE} and {@link MAX_ANIMATION_RATE}. */
	set playbackRate(value: number) {
		const clampedValue = clamp(value, MIN_ANIMATION_RATE, MAX_ANIMATION_RATE)
		if (this._playbackRate === clampedValue) {
			return
		}
		this._playbackRate = clampedValue
		for (const animation of this.animations.values()) {
			animation.updatePlaybackRate(clampedValue)
		}
	}

	/** Add the specified {@link FlashableElement} element and all of its subelements to the
	 * elements handled by this instance */
	addElement(element: FlashableElement): void {
		const id = element.getFlashableID()
		if (this.elements.has(id)) {
			return
		}
		const animation = element.createFlashAnimation()
		animation.playbackRate = this._playbackRate
		animation.id = `${id}-flash-animation`
		this.animations.set(id, animation)
		for (const subelement of element.getFlashableSubelements()) {
			this.addElement(subelement)
		}
	}

	/** Remove the flashable element associated to the specified ID and all of its subelements from
	 * the elements handled by this instance. All of the animations associated to the removed
	 * elements are canceled. */
	removeElement(id: FlashableID): void {
		const element = this.elements.get(id)
		if (element === undefined) {
			return
		}
		this.cancel(id)
		this.elements.delete(id)
		this.animations.delete(id)
		for (const subelement of element.getFlashableSubelements()) {
			this.removeElement(subelement.getFlashableID())
		}
	}

	/** Plays the flash animation associated to the specified id */
	play(id: FlashableID): void {
		this.animations.get(id)?.play()
	}

	/** Pause the flash animation associated to the specified id */
	pause(id: FlashableID): void {
		this.animations.get(id)?.pause()
	}

	/** Cancel the flash animation associated to the specified id */
	cancel(id: FlashableID): void {
		this.animations.get(id)?.cancel()
	}

	/** Wait for the flash animation associated to the specified id to finish playing */
	async wait(id: FlashableID): Promise<void> {
		const animation = this.animations.get(id)
		if (animation === undefined) {
			return
		}
		await safeWaitFinished(animation)
	}

	/** Pause all flash animations handled by this instance */
	pauseAll(): void {
		for (const animation of this.animations.values()) {
			animation.pause()
		}
	}

	/** Resume all paused flash animations handled by this instance */
	resumeAll(): void {
		for (const animation of this.animations.values()) {
			if (animation.playState === "paused") {
				animation.play()
			}
		}
	}

	/** Cancel all flash animations handled by this instance */
	cancelAll(): void {
		for (const animation of this.animations.values()) {
			animation.cancel()
		}
	}

	/** Wait all flash animations handled by this instance to finish playing */
	async waitAll(): Promise<void> {
		await Promise.allSettled(this.animations.values().map(safeWaitFinished))
	}

	/** @returns Wether the flash animation associated to the element with the specified ID is playing or not */
	isPlaying(id: FlashableID): boolean {
		const animation = this.animations.get(id)
		return animation !== undefined && animation.playState === "running"
	}
}

/** Wrapper around {@link Animation.finished} that catches the error thrown when an animation is canceled */
async function safeWaitFinished(animation: Animation): Promise<Animation> {
	return animation.finished.catch(() => animation)
}
