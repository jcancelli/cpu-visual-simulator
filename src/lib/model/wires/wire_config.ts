import { InvalidArgumentError } from "$lib/errors/util"
import EventBus, { type EventListener } from "$lib/utility/event_bus"
import { Color } from "pixi.js"

/** Metadata that defines a "class" of wires inside a {@link WireGraph} instance */
export type WireConfigBlueprint = {
	/** ID of the configuration */
	id: string
	/** Width of the wires */
	width: number
	/** Base color of the wires */
	baseColor: Color
	/** Color of the animations on this wire */
	animationColor: Color
}

type WireConfigEvents = "width-changed" | "base-color-changed" | "animation-color-changed"
type WireConfigEventsTypes = {
	"width-changed": number
	"base-color-changed": Color
	"animation-color-changed": Color
}

/**
 * Metadata that defines a "class" of wires inside a {@link WireGraph} instance.
 * Should not be created directly */
export class WireConfig {
	private readonly eventBus = new EventBus<WireConfigEvents, WireConfigEventsTypes>()

	constructor(
		/** ID of the configuration */
		private readonly id: string,
		/** Width of the wires */
		private width: number,
		/** Base color of the wires */
		private baseColor: Color,
		/** Color of the animations on this wire */
		private animationColor: Color
	) {
		if (!id || id === "") {
			throw new InvalidArgumentError("Invalid ID")
		}
		if (width <= 0) {
			throw new InvalidArgumentError("Invalid wire width")
		}
		if (!baseColor) {
			throw new InvalidArgumentError("Invalid base color")
		}
		if (!animationColor) {
			throw new InvalidArgumentError("Invalid animation color")
		}
	}

	/** Return configuration ID */
	getID(): string {
		return this.id
	}

	/** Return wires' width */
	getWidth(): number {
		return this.width
	}

	/** Set wires' width. Values must be > 0 */
	setWidth(value: number) {
		if (value <= 0) {
			throw new InvalidArgumentError("Invalid width")
		}
		if (this.width === value) {
			return
		}
		this.width = value
		this.eventBus.notify("width-changed", value)
	}

	/** Return wires' base color */
	getBaseColor(): Color {
		return new Color(this.baseColor)
	}

	/** Set wires' base color */
	setBaseColor(value: Color) {
		if (!value) {
			throw new InvalidArgumentError("Invalid base color")
		}
		if (this.baseColor.toNumber() === value.toNumber()) {
			return
		}
		this.baseColor = new Color(value)
		this.eventBus.notify("base-color-changed", value)
	}

	/** Return wiress' animation color */
	getAnimationColor(): Color {
		return new Color(this.animationColor)
	}

	/** Set wires' animation color */
	setAnimationColor(value: Color) {
		if (!value) {
			throw new InvalidArgumentError("Invalid animation color")
		}
		if (this.animationColor.toNumber() === value.toNumber()) {
			return
		}
		this.animationColor = new Color(value)
		this.eventBus.notify("animation-color-changed", value)
	}

	/** Subscribe a listener that will be notified when the width value changes */
	addWidthChangedListener(listener: EventListener<number>) {
		this.eventBus.addListener("width-changed", listener)
	}

	/** Unsubscribe a listener */
	removeWidthChangedListener(listener: EventListener<number>) {
		this.eventBus.removeListener("width-changed", listener)
	}

	/** Subscribe a listener that will be notified when the baseColor value changes */
	addBaseColorChangedListener(listener: EventListener<Color>) {
		this.eventBus.addListener("base-color-changed", listener)
	}

	/** Unsubscribe a listener */
	removeBaseColorChangedListener(listener: EventListener<Color>) {
		this.eventBus.removeListener("base-color-changed", listener)
	}

	/** Subscribe a listener that will be notified when the animationColor value changes */
	addAnimationColorChangedListener(listener: EventListener<Color>) {
		this.eventBus.addListener("animation-color-changed", listener)
	}

	/** Unsubscribe a listener */
	removeAnimationColorChangedListener(listener: EventListener<Color>) {
		this.eventBus.removeListener("animation-color-changed", listener)
	}
}
