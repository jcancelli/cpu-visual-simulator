const RGB_PATTERN = /rgb\(\s*\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*\)/
const RGBA_PATTERN = /rgba\(\s*\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*\)/
const RGB_OR_RGBA_PATTERN = new RegExp(`^(${RGB_PATTERN.source})|(${RGBA_PATTERN.source})$`)
const HEX_PATTERN = /^(#[\daAbBcCdDeEfF]{3})|(#[\daAbBcCdDeEfF]{6})$/

export class Color {
	public readonly r: number
	public readonly g: number
	public readonly b: number
	public readonly a: number

	constructor(r: number, g: number, b: number, a: number = 255) {
		this.r = r
		this.g = g
		this.b = b
		this.a = a
	}

	/**
	 * Converts a string into a number object
	 * @param {string} val - A string representing the color.
	 * Can either be in the formats: rgba(number, number, number, number), rgb(number, number, number)
	 * or hexadecimal value (eg. #FFFFFF)
	 */
	public static fromString(val: string): Color {
		return cssStringColorToColor(val)
	}

	public toRgbaString(): string {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
	}

	public toRgbString(): string {
		return `rgb(${this.r}, ${this.g}, ${this.b})`
	}

	public static readonly GREEN = new Color(0, 255, 0)
}

export function cssStringColorToColor(css: string): Color {
	if (RGB_OR_RGBA_PATTERN.test(css)) {
		return rgbaStringToColor(css)
	} else if (HEX_PATTERN.test(css)) {
		return hexStringToColor(css)
	} else {
		throw new Error(
			`Error while parsing css color value: unrecognized css property color value pattern: "${css}"`
		)
	}
}

export function rgbaStringToColor(rgba: string): Color {
	const [r, g, b, a] = rgba.match(/\d{1,3}/g).map(val => parseInt(val, 10))
	return new Color(r, g, b, a === undefined ? 255 : a)
}

export function hexStringToColor(hex: string): Color {
	const [r, g, b] = hex
		.substring(1)
		.match(/.{2}/g)
		.map(val => parseInt(val, 16))
	return new Color(r, g, b)
}
