import { Updater, writable } from "svelte/store"

const { subscribe, set, update } = writable({
	showDebugger: false,
	showNodes: false,
	showNodeNames: false,
	showNodesCoordinates: false
})

function setShowDebugger(showDebugger: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		showDebugger: showDebugger
	}))
}

function updateShowDebugger(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		showDebugger: updater(oldSettings.showDebugger)
	}))
}

function setShowNodes(showNodes: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		showNodes
	}))
}

function updateShowNodes(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		showNodes: updater(oldSettings.showNodes)
	}))
}

function setShowNodeNames(showNodeNames: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		showNodeNames: showNodeNames
	}))
}

function updateShowNodeNames(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		showNodeNames: updater(oldSettings.showNodeNames)
	}))
}

function setShowNodeCoordinates(showNodesCoordinates: boolean): void {
	update(oldSettings => ({
		...oldSettings,
		showNodesCoordinates
	}))
}

function updateShowNodeCoordinates(updater: Updater<boolean>): void {
	update(oldSettings => ({
		...oldSettings,
		showNodesCoordinates: updater(oldSettings.showNodesCoordinates)
	}))
}

export default {
	subscribe,
	setShowDebugger,
	updateShowDebugger,
	setShowNodes,
	updateShowNodes,
	setShowNodeNames,
	updateShowNodeNames,
	setShowNodeCoordinates,
	updateShowNodeCoordinates
}
