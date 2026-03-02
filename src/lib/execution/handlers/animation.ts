import type { FlashAnimationsPlayback } from "$lib/state/flash_animations_playback.svelte"
import { ActionType } from "$lib/types/action"
import type {
	CancelUIElementAnimationAction,
	FlashUIElementAction,
	WaitUIElementAnimationAction,
} from "../action/animation"
import type { ActionHandler } from "../action_handler"

/** {@link ActionHandler} for {@link FlashUIElementAction} */
export class FlashUIElementActionHandler implements ActionHandler<FlashUIElementAction> {
	private readonly animations: FlashAnimationsPlayback

	constructor(animations: FlashAnimationsPlayback) {
		this.animations = animations
	}

	get actionType(): ActionType {
		return ActionType.FLASH_UI_ELEMENT
	}

	handle(action: FlashUIElementAction): void {
		this.animations.play(action.element)
	}
}

/** {@link ActionHandler} for {@link WaitUIElementAnimationAction} */
export class WaitUIElementAnimationActionHandler implements ActionHandler<WaitUIElementAnimationAction> {
	private readonly animations: FlashAnimationsPlayback

	constructor(animations: FlashAnimationsPlayback) {
		this.animations = animations
	}

	get actionType(): ActionType {
		return ActionType.WAIT_UI_ELEMENT_ANIMATION
	}

	async handle(action: WaitUIElementAnimationAction): Promise<void> {
		await this.animations.wait(action.element)
	}
}

/** {@link ActionHandler} for {@link CancelUIElementAnimationAction} */
export class CancelUIElementAnimationActionHandler implements ActionHandler<CancelUIElementAnimationAction> {
	private readonly animations: FlashAnimationsPlayback

	constructor(animations: FlashAnimationsPlayback) {
		this.animations = animations
	}

	get actionType(): ActionType {
		return ActionType.CANCEL_UI_ELEMENT_ANIMATION
	}

	handle(action: CancelUIElementAnimationAction): void {
		this.animations.cancel(action.element)
	}
}
