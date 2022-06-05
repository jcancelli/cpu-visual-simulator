import { Updater, writable } from "svelte/store"
import CheckedError from "../errors/CheckedError"
import { addressToIndex, FIRST_ADDRESS, indexToAddress, LAST_ADDRESS } from "../util/ramUtil"
import ramStore from "./ramStore"

const { subscribe, set, update } = writable([] as string[])
let symbolTable: string[] = []

clear()

function setSync(value: string[]): void {
	set(value)
	symbolTable = value
}

function updateSync(updater: Updater<string[]>): void {
	update(updater)
	symbolTable = updater(symbolTable)
}

function getLabel(address: number): string {
	return symbolTable[addressToIndex(address)]
}

function getAddress(label: string): number {
	if (label === "") return -1
	const index = symbolTable.findIndex(symbol => symbol === label)
	return index === -1 ? -1 : indexToAddress(index)
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
		throw new CheckedError("Label already exists")
	}
	const index = addressToIndex(address)
	updateSync(oldSymbolTable =>
		oldSymbolTable.map((oldValue, i) => (i === index ? label : oldValue))
	)
	if (oldLabel !== "") {
		if (label === "") {
			ramStore.deleteLabel(oldLabel)
		} else {
			ramStore.updateLabels(oldLabel, label)
		}
	}
}

function clear() {
	for (let i = addressToIndex(FIRST_ADDRESS); i <= addressToIndex(LAST_ADDRESS); i++) {
		symbolTable[i] = ""
	}
	set(symbolTable)
}

export default {
	subscribe,
	getLabel,
	getAddress,
	setLabel,
	hasLabel,
	clear
}
