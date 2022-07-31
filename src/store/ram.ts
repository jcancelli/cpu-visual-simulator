import { Updater, writable } from "svelte/store"
import Instruction from "../instruction/Instruction"
import { parseSymbolic } from "../instruction/instructionParser"
import { addressToIndex, FIRST_ADDRESS, isValidAddress, LAST_ADDRESS, WORD_SIZE } from "../util/ramUtil"

const { subscribe, set, update } = writable<Instruction[]>([])
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
	updateSync(oldRam => oldRam.map((oldInstruction, i) => (index === i ? instruction : oldInstruction)))
}

function read(address: number): Instruction {
	if (!isValidAddress(address)) {
		throw new Error("Invalid address: " + address)
	}
	return ram[addressToIndex(address)]
}

function clear() {
	for (let i = addressToIndex(FIRST_ADDRESS); i <= addressToIndex(LAST_ADDRESS); i++) {
		ram[i] = parseSymbolic("NOP")
	}
	setSync(ram)
}

function updateLabels(label: string, newLabel: string): void {
	updateSync(oldRam =>
		oldRam.map(instruction => {
			if (instruction.symbolicOperand === label) {
				return new Instruction(instruction.symbolicOpcode, newLabel, instruction.value)
			} else if (instruction.symbolicOperand === "#" + label) {
				return new Instruction(instruction.symbolicOpcode, "#" + newLabel, instruction.value)
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
				return new Instruction(
					instruction.symbolicOpcode,
					instruction.numericOperand().toString(),
					instruction.value
				)
			} else if (instruction.symbolicOperand === "#" + label) {
				return new Instruction(
					instruction.symbolicOpcode,
					"#" + instruction.numericOperand(),
					instruction.value
				)
			} else {
				return instruction
			}
		})
	)
}

// loads a program from an array of instruction
// an instruction in the input array should be at the same index as its intended address
// all addresses such as program[address] === undefined are assumed to be NOP
function importInstructions(program: Instruction[]) {
	clear()
	for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
		write(address, program[address] || parseSymbolic("NOP"))
	}
}

function exportInstructions(): Instruction[] {
	const program: Instruction[] = []
	for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
		program[address] = read(address)
	}
	return program
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
	importInstructions,
	exportInstructions,
	moveFirstHalfUpFromAddress,
	moveFirstHalfDownFromAddress,
	moveSecondHalfUpFromAddress,
	moveSecondHalfDownFromAddress
}
