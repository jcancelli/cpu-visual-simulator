import type { FlashAnimation } from "./animation"

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
