import { InvalidArgumentError } from "$lib/errors/util"
import { Color } from "pixi.js"
import ListenersManager, { type Listener } from "../listeners_manager"

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

/**
 * Metadata that defines a "class" of wires inside a {@link WireGraph} instance.
 * Should not be created directly */
export class WireConfig {
	private readonly widthListeners = new ListenersManager<number>()
	private readonly baseColorListeners = new ListenersManager<Color>()
	private readonly animationColorListeners = new ListenersManager<Color>()

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
		this.widthListeners.notify(value)
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
		this.baseColorListeners.notify(value)
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
		this.animationColorListeners.notify(value)
	}

	/** Subscribe a listener that will be notified when the width value changes */
	addWidthChangedListener(listener: Listener<number>) {
		this.widthListeners.addListener(listener)
	}

	/** Unsubscribe a listener */
	removeWidthChangedListener(listener: Listener<number>) {
		this.widthListeners.removeListener(listener)
	}

	/** Subscribe a listener that will be notified when the baseColor value changes */
	addBaseColorChangedListener(listener: Listener<Color>) {
		this.baseColorListeners.addListener(listener)
	}

	/** Unsubscribe a listener */
	removeBaseColorChangedListener(listener: Listener<Color>) {
		this.baseColorListeners.removeListener(listener)
	}

	/** Subscribe a listener that will be notified when the animationColor value changes */
	addAnimationColorChangedListener(listener: Listener<Color>) {
		this.animationColorListeners.addListener(listener)
	}

	/** Unsubscribe a listener */
	removeAnimationColorChangedListener(listener: Listener<Color>) {
		this.animationColorListeners.removeListener(listener)
	}
}
