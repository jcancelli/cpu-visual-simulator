import { UI as UIElementID } from "$lib/types/ui"
import { clamp } from "$lib/util/math"

/** Minimum value for a flash animation playback rate */
export const MIN_ANIMATION_RATE = 0.1
/** Maximum value for a flash animation playback rate */
export const MAX_ANIMATION_RATE = 3.0
/** Default value for a flash animation playback rate */
export const DEFAULT_ANIMATION_RATE = 1.0

/** An element that has a flash animation */
export interface Flashable {
	createFlashAnimation(): Animation
}

/** Allows to play/pause/cancel flash animations of {@link Flashable} elements identified by their {@link UIElementID} */
export class FlashAnimations {
	/** The animations handled by this instance indexed by their respective UI element ID */
	private animations: Map<UIElementID, Animation>
	/** The playback rate of the flash animations handled by this instance.
	 * The value is clamped between {@link MIN_ANIMATION_RATE} and {@link MAX_ANIMATION_RATE}. */
	private _playbackRate: number

	constructor() {
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

	/** Add the specified {@link Flashable} element to the elements handled by this instance */
	addElement(id: UIElementID, element: Flashable): void {
		if (this.animations.has(id)) {
			this.removeElement(id)
		}
		const animation = element.createFlashAnimation()
		animation.playbackRate = this._playbackRate
		animation.id = `${UIElementID[id]}-flash-animation`
		this.animations.set(id, animation)
	}

	/** Remove the specified {@link Flashable} element from the elements handled by this instance.
	 * All flash animations associated to the element are canceled. */
	removeElement(id: UIElementID): void {
		if (!this.animations.has(id)) {
			return
		}
		this.cancel(id)
		this.animations.delete(id)
	}

	/** Plays the flash animation associated to the specified UI element */
	play(id: UIElementID): void {
		this.animations.get(id)?.play()
	}

	/** Pause the flash animation associated to the specified UI element */
	pause(id: UIElementID): void {
		this.animations.get(id)?.pause()
	}

	/** Cancel the flash animation associated to the specified UI element */
	cancel(id: UIElementID): void {
		this.animations.get(id)?.cancel()
	}

	/** Wait for the flash animation associated to the specified UI element to finish playing */
	async wait(id: UIElementID): Promise<void> {
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
	isPlaying(id: UIElementID): boolean {
		const animation = this.animations.get(id)
		return animation !== undefined && animation.playState === "running"
	}
}

/** Wrapper around {@link Animation.finished} that catches the error thrown when an animation is canceled */
async function safeWaitFinished(animation: Animation): Promise<Animation> {
	return animation.finished.catch(() => animation)
}
