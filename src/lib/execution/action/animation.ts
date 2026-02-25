import { ActionType } from "$lib/types/action"
import type { UI } from "$lib/types/ui"
import { Action } from "../task"

/** Base class for all actions regarding animations */
export abstract class AnimationAction extends Action {}

/** Flash an UI element */
export class FlashUIElementAction extends AnimationAction {
	public readonly element: UI

	constructor(element: UI) {
		super()
		this.element = element
	}

	override get actionType(): ActionType {
		return ActionType.FLASH_UI_ELEMENT
	}
}

/** Wait for an UI element animation to finish */
export class WaitUIElementAnimationAction extends AnimationAction {
	public readonly element: UI

	constructor(element: UI) {
		super()
		this.element = element
	}

	override get actionType(): ActionType {
		return ActionType.WAIT_UI_ELEMENT_ANIMATION
	}
}

/** Cancel an UI element animation */
export class CancelUIElementAnimationAction extends AnimationAction {
	public readonly element: UI

	constructor(element: UI) {
		super()
		this.element = element
	}

	override get actionType(): ActionType {
		return ActionType.CANCEL_UI_ELEMENT_ANIMATION
	}
}

/** Flash an UI element */
export function flashUI(element: UI): FlashUIElementAction {
	return new FlashUIElementAction(element)
}

/** Wait for an UI element animation to finish */
export function waitUIAnimation(element: UI): WaitUIElementAnimationAction {
	return new WaitUIElementAnimationAction(element)
}

/** Cancel an UI element animation */
export function cancelUIAnimation(element: UI): CancelUIElementAnimationAction {
	return new CancelUIElementAnimationAction(element)
}
