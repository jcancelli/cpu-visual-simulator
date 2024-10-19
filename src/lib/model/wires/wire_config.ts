import { InvalidArgumentError } from "$lib/errors/util"
import { Color } from "pixi.js"

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

	getID(): string {
		return this.id
	}

	getWidth(): number {
		return this.width
	}

	setWidth(value: number) {
		if (value <= 0) {
			throw new InvalidArgumentError("Invalid width")
		}
		this.width = value
	}

	getBaseColor(): Color {
		return new Color(this.baseColor)
	}

	setBaseColor(value: Color) {
		if (!value) {
			throw new InvalidArgumentError("Invalid base color")
		}
		this.baseColor = new Color(value)
	}

	getAnimationColor(): Color {
		return new Color(this.animationColor)
	}

	setAnimationColor(value: Color) {
		if (!value) {
			throw new InvalidArgumentError("Invalid animation color")
		}
		this.animationColor = new Color(value)
	}
}
