import { get, writable } from "svelte/store"
import CheckedError from "../errors/CheckedError"
import { FIRST_ADDRESS, LAST_ADDRESS, WORD_SIZE } from "../util/ramUtil"
import ramStore from "./ram"
import text from "./text"

const store = writable<string[]>([])

clear()

function getLabel(address: number): string {
	return get(store)[address]
}

function getAddress(label: string): number {
	if (label === "") return -1
	const index = get(store).findIndex(symbol => symbol === label)
	return index === -1 ? -1 : index
}

function hasLabel(label: string): boolean {
	return getAddress(label) !== -1
}

function setLabel(address: number, label: string): void {
	const oldLabel = getLabel(address)
	if (oldLabel === label) {
		return
	}
	if (hasLabel(label)) {
		throw new CheckedError(get(text).errors.symbol_table.label_already_exists)
	}
	store.update(oldValues => {
		oldValues[address] = label
		return oldValues
	})
	if (oldLabel !== "") {
		if (label === "") {
			ramStore.deleteLabel(oldLabel)
		} else {
			ramStore.updateLabels(oldLabel, label)
		}
	}
}

function clear() {
	let arr = []
	for (let i = FIRST_ADDRESS; i <= LAST_ADDRESS; i += WORD_SIZE) {
		arr[i] = ""
	}
	store.set(arr)
}

function importLabels(labels: string[]) {
	store.set([...labels])
}

function exportLabels(): string[] {
	return [...get(store)]
}

export default {
	subscribe: store.subscribe,
	getLabel,
	getAddress,
	setLabel,
	hasLabel,
	clear,
	importLabels,
	exportLabels
}
