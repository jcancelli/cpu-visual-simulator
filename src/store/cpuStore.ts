import { Updater, writable } from "svelte/store"
import Instruction from "../instruction/Instruction"
import { Operators } from "../instruction/Opcode"
import BinaryValue from "../util/BinaryValue"
import { FIRST_ADDRESS, isValidAddress, WORD_SIZE } from "../util/ramUtil"

interface Cpu {
	instructionRegister: Instruction | null
	programCounter: BinaryValue
	increment: BinaryValue
	alu1: BinaryValue | null
	alu2: BinaryValue | null
	operation: Operators
	accumulator: BinaryValue
	zeroFlag: boolean
	negativeFlag: boolean
	isJumping: boolean
	isHalting: boolean
}

let cpu: Cpu
const { subscribe, set, update } = writable<Cpu>()

reset()

// updates the store and keeps the local value in sync
function setSync(value: Cpu) {
	set(value)
	cpu = value
}

// updates the store and keeps the local value in sync
function updateSync(updater: Updater<Cpu>): void {
	update(updater)
	cpu = updater(cpu)
}

function reset() {
	setSync({
		instructionRegister: null,
		programCounter: new BinaryValue(8, FIRST_ADDRESS),
		increment: new BinaryValue(8, WORD_SIZE),
		alu1: null,
		alu2: null,
		operation: "",
		accumulator: new BinaryValue(8, 0),
		zeroFlag: true,
		negativeFlag: false,
		isJumping: false,
		isHalting: false
	})
}

// clears fields such as alu1, alu2, instructionregister ...
function clear() {
	updateSync(oldCpu => ({
		...oldCpu,
		instructionRegister: null,
		alu1: null,
		alu2: null,
		operation: "",
		isJumping: false,
		isHalting: false
	}))
}

function setIR(instruction: Instruction | null) {
	if (instruction && !instruction.opcode) {
		throw new Error("Invalid opcode")
	}
	updateSync(oldCpu => ({
		...oldCpu,
		instructionRegister: instruction
	}))
}

function setPC(value: number | BinaryValue) {
	if (typeof value === "number") {
		value = new BinaryValue(8, value)
	}
	if (!isValidAddress(value.unsigned())) {
		throw new Error("Invalid address")
	}
	updateSync(oldCpu => ({
		...oldCpu,
		programCounter: value as BinaryValue
	}))
}

function setALU1(value: number | BinaryValue | null) {
	if (typeof value === "number") {
		value = new BinaryValue(8, value)
	}
	updateSync(oldCpu => ({
		...oldCpu,
		alu1: value === null ? null : (value as BinaryValue)
	}))
}

function setALU2(value: number | null | BinaryValue) {
	if (typeof value === "number") {
		value = new BinaryValue(8, value)
	}
	updateSync(oldCpu => ({
		...oldCpu,
		alu2: value === null ? null : (value as BinaryValue)
	}))
}

function setACC(value: number | BinaryValue) {
	if (typeof value === "number") {
		value = new BinaryValue(8, value)
	}
	updateSync(oldCpu => ({
		...oldCpu,
		accumulator: value as BinaryValue
	}))
}

function setOperation(value: Operators) {
	updateSync(oldCpu => ({
		...oldCpu,
		operation: value
	}))
}

function setZeroFlag(value: boolean) {
	updateSync(oldCpu => ({
		...oldCpu,
		zeroFlag: value
	}))
}

function setNegativeFlag(value: boolean) {
	updateSync(oldCpu => ({
		...oldCpu,
		negativeFlag: value
	}))
}

function setIsJumping(value: boolean) {
	updateSync(oldCpu => ({
		...oldCpu,
		isJumping: value
	}))
}

function setIsHalting(value: boolean) {
	updateSync(oldCpu => ({
		...oldCpu,
		isHalting: value
	}))
}

export default {
	subscribe,
	reset,
	clear,
	setIR,
	setPC,
	setALU1,
	setALU2,
	setOperation,
	setACC,
	setZeroFlag,
	setNegativeFlag,
	setIsJumping,
	setIsHalting
}
