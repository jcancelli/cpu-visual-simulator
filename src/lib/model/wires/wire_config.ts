import { InvalidArgumentError } from "$lib/errors/util"
import { Color } from "pixi.js"
import ListenersManager, { type Listener } from "../listeners_manager"

/** Metadata that defines a "class" of wires inside a {@link import("./graph").WireGraph} instance */
export type WireConfigBlueprint = {
	id: string
	width: number
	baseColor: Color
	animationColor: Color
}

/**
 * Metadata that defines a "class" of wires inside a {@link import("./graph").WireGraph} instance.
 * Should not be created directly */
export class WireConfig {
	private readonly widthListeners = new ListenersManager<number>()
	private readonly baseColorListeners = new ListenersManager<Color>()
	private readonly animationColorListeners = new ListenersManager<Color>()

	constructor(
		private readonly id: string,
		private width: number,
		private baseColor: Color,
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
		const hasChanged = this.width !== value
		this.width = value
		if (hasChanged) {
			this.widthListeners.notify(value)
		}
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
		const hasChanged = this.baseColor.toNumber() !== value.toNumber()
		this.baseColor = new Color(value)
		if (hasChanged) {
			this.baseColorListeners.notify(value)
		}
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
		const hasChanged = this.baseColor.toNumber() !== value.toNumber()
		this.animationColor = new Color(value)
		if (hasChanged) {
			this.animationColorListeners.notify(value)
		}
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
