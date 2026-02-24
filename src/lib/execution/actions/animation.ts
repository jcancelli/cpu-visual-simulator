import { ActionType } from "$lib/types/action"
import type { UI } from "$lib/types/ui"
import { Action } from "../task"

/** Base class for all actions regarding animations */
export abstract class AnimationAction extends Action {}

/** Flash an UI element */
export class FlashUIElementAction extends AnimationAction {
	public readonly element: UI

	constructor(element: UI) {
		super(ActionType.FLASH_UI_ELEMENT)
		this.element = element
	}
}

/** Wait for an UI element animation to finish */
export class WaitUIElementAnimationAction extends AnimationAction {
	public readonly element: UI

	constructor(element: UI) {
		super(ActionType.WAIT_UI_ELEMENT_ANIMATION)
		this.element = element
	}
}

/** Cancel an UI element animation */
export class CancelUIElementAnimationAction extends AnimationAction {
	public readonly element: UI

	constructor(element: UI) {
		super(ActionType.CANCEL_UI_ELEMENT_ANIMATION)
		this.element = element
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
