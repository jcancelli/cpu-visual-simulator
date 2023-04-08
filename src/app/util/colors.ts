const RGB_PATTERN = /rgb\(\s*\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*\)/
const RGBA_PATTERN = /rgba\(\s*\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*\)/
const RGB_OR_RGBA_PATTERN = new RegExp(`^(${RGB_PATTERN.source})|(${RGBA_PATTERN.source})$`)
const HEX_PATTERN = /^(#[\daAbBcCdDeEfF]{3})|(#[\daAbBcCdDeEfF]{6})$/

export interface Color {
	r: number
	g: number
	b: number
	a: number
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
	return { r, g, b, a: a === undefined ? 1.0 : a }
}

export function hexStringToColor(hex: string): Color {
	const [r, g, b] = hex
		.substring(1)
		.match(/.{2}/)
		.map(val => parseInt(val, 16))
	return { r, g, b, a: 1 }
}
