import { Updater, writable } from "svelte/store"

const { subscribe, set, update } = writable({
	animationSpeedMultiplier: 1.0,
	animate: true
})

function setAnimationSpeedMultiplier(animationSpeedMultiplier: number): void {
	update(oldSettings => ({
		...oldSettings,
		animationSpeedMultiplier
	}))
}

function updateAnimationSpeedMultiplier(updater: Updater<number>): void {
	update(oldSettings => ({
		...oldSettings,
		animationSpeedMultiplier: updater(oldSettings.animationSpeedMultiplier)
	}))
}

function setAnimate(animate: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		animate
	}))
}

function updateAnimate(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		animate: updater(oldSettings.animate)
	}))
}

export default {
	subscribe,
	setAnimationSpeedMultiplier,
	updateAnimationSpeedMultiplier,
	setAnimate,
	updateAnimate
}
