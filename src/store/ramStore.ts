import { Updater, writable } from "svelte/store"
import Instruction from "../instruction/Instruction"
import { parse } from "../instruction/instructionParser"
import { addressToIndex, FIRST_ADDRESS, isValidAddress, LAST_ADDRESS } from "../util/ramUtil"

const { subscribe, set, update } = writable(new Array() as Instruction[])
let ram: Instruction[] = []

// initialize
clear()

// updates the store and keeps the local value in sync
function setSync(value: Instruction[]) {
	set(value)
	ram = value
}

// updates the store and keeps the local value in sync
function updateSync(updater: Updater<Instruction[]>): void {
	update(updater)
	ram = updater(ram)
}

function write(address: number, instruction: Instruction): void {
	if (!isValidAddress(address)) {
		throw new Error("Invalid address: " + address)
	}
	const index = addressToIndex(address)
	updateSync(oldRam =>
		oldRam.map((oldInstruction, i) => (index === i ? instruction : oldInstruction))
	)
}

function read(address: number): Instruction {
	if (!isValidAddress(address)) {
		throw new Error("Invalid address: " + address)
	}
	return ram[addressToIndex(address)]
}

function clear() {
	for (let i = addressToIndex(FIRST_ADDRESS); i <= addressToIndex(LAST_ADDRESS); i++) {
		ram[i] = parse("NOP", false)
	}
	setSync(ram)
}

function updateLabels(label: string, newLabel: string): void {
	updateSync(oldRam =>
		oldRam.map(instruction => {
			if (instruction.symbolicOperand === label) {
				return {
					...instruction,
					symbolicOperand: newLabel
				}
			} else if (instruction.symbolicOperand === "#" + label) {
				return {
					...instruction,
					symbolicOperand: "#" + newLabel
				}
			} else {
				return instruction
			}
		})
	)
}

function deleteLabel(label: string): void {
	updateSync(oldRam =>
		oldRam.map(instruction => {
			if (instruction.symbolicOperand === label) {
				return {
					...instruction,
					symbolicOperand: "" + instruction.numericOperand
				}
			} else if (instruction.symbolicOperand === "#" + label) {
				return {
					...instruction,
					symbolicOperand: "#" + instruction.numericOperand
				}
			} else {
				return instruction
			}
		})
	)
}

function moveFirstHalfUpFromAddress(address: number) {
	console.log("moveFirstHalfUpFromAddress " + address)
}

function moveFirstHalfDownFromAddress(address: number) {
	console.log("moveFirstHalfDownFromAddress " + address)
}

function moveSecondHalfUpFromAddress(address: number) {
	console.log("moveSecondHalfUpFromAddress " + address)
}

function moveSecondHalfDownFromAddress(address: number) {
	console.log("moveSecondHalfDownFromAddress " + address)
}

export default {
	subscribe,
	read,
	write,
	clear,
	updateLabels,
	deleteLabel,
	moveFirstHalfUpFromAddress,
	moveFirstHalfDownFromAddress,
	moveSecondHalfUpFromAddress,
	moveSecondHalfDownFromAddress
}
