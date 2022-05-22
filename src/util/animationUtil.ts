import { get } from "svelte/store"
import animationStore from "../store/animationStore"

export type Color = { r: number; g: number; b: number }

//https://stackoverflow.com/a/11293378
export function lerp(a, b, u) {
	return (1 - u) * a + u * b
}

//https://stackoverflow.com/a/11293378 - customized
export async function fade(
	element: HTMLElement | SVGSVGElement,
	property: string,
	start: Color,
	end: Color
) {
	return new Promise<void>((resolve, reject) => {
		const baseDuration = 300
		let u = 0.0
		let animationStart
		const frame = (timestamp: DOMHighResTimeStamp) => {
			if (!animationStart) {
				animationStart = timestamp
			}
			if (u >= 1.0) {
				resolve()
				element.style.setProperty(property, `rgb(${end.r}, ${end.g}, ${end.b})`)
				return
			}
			const r = Math.round(lerp(start.r, end.r, u))
			const g = Math.round(lerp(start.g, end.g, u))
			const b = Math.round(lerp(start.b, end.b, u))
			element.style.setProperty(property, `rgb(${r}, ${g}, ${b})`)
			const elapsed = timestamp - animationStart
			u = elapsed / (baseDuration * get(animationStore).animationSpeedMultiplier)
			requestAnimationFrame(frame)
		}
		requestAnimationFrame(frame)
	})
}

export async function flash(
	element: HTMLElement | SVGSVGElement,
	property: string,
	start: Color,
	end: Color
) {
	return fade(element, property, start, end).then(() => fade(element, property, end, start))
}
