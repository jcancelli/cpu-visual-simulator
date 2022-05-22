import { Updater, writable } from "svelte/store"

const { subscribe, set, update } = writable({
	binary: false,
	showLabels: true
})

function setBinary(binary: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		binary
	}))
}

function updateBinary(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		binary: updater(oldSettings.binary)
	}))
}

function setShowLabels(showLabels: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		showLabels
	}))
}

function updateShowLabels(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		showLabels: updater(oldSettings.showLabels)
	}))
}

export default {
	subscribe,
	setBinary,
	updateBinary,
	setShowLabels,
	updateShowLabels
}
