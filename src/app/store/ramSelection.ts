import { Updater, writable } from "svelte/store"
import { LAST_ADDRESS, FIRST_ADDRESS, isValidAddress } from "../util/ram"
import { WORD_SIZE } from "../util/cpu"

type Column = "CELL" | "LABEL"

let selection = {
	address: null,
	column: "CELL" as Column
}
const { subscribe, set, update } = writable(selection)

// updates the store and keeps the local value in sync
function setSync(value: typeof selection) {
	set(value)
	selection = value
}

// updates the store and keeps the local value in sync
function updateSync(updater: Updater<typeof selection>): void {
	update(updater)
	selection = updater(selection)
}

function selectDown() {
	updateSync(previous => {
		let tmp = (previous.address += WORD_SIZE)
		return {
			...previous,
			address: tmp > LAST_ADDRESS ? LAST_ADDRESS : tmp
		}
	})
}

function selectUp() {
	updateSync(previous => {
		let tmp = (previous.address -= WORD_SIZE)
		return {
			...previous,
			address: tmp < FIRST_ADDRESS ? FIRST_ADDRESS : tmp
		}
	})
}

function selectLeft() {
	updateSync(previous => ({
		...previous,
		column: "LABEL"
	}))
}

function selectRight() {
	updateSync(previous => ({
		...previous,
		column: "CELL"
	}))
}

function select(address: number, column: Column = "CELL") {
	if (!isValidAddress(address)) throw new Error("Invalid address")
	updateSync(previous => ({
		...previous,
		address,
		column
	}))
}

function deselect() {
	updateSync(previous => ({
		...previous,
		address: null
	}))
}

function noSelection() {
	return selection.address === null
}

function isSelected(address: number, column: Column): boolean {
	return selection.address === address && selection.column === column
}

export default {
	subscribe,
	selectUp,
	selectDown,
	selectLeft,
	selectRight,
	select,
	deselect,
	noSelection,
	isSelected
}
