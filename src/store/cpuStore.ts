import { Updater, writable } from "svelte/store"
import Instruction from "../instruction/Instruction"
import { Operators } from "../instruction/Opcode"
import { isValidSigned8bit, isValidUnsigned8bit } from "../util/binaryUtil"
import { FIRST_ADDRESS, isValidAddress, LAST_ADDRESS, WORD_SIZE } from "../util/ramUtil"

interface Cpu {
	instructionRegister: Instruction | null
	programCounter: number
	increment: number
	alu1: number | null
	alu2: number | null
	operation: Operators
	accumulator: number
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
		programCounter: FIRST_ADDRESS,
		increment: WORD_SIZE,
		alu1: null,
		alu2: null,
		operation: "",
		accumulator: 0,
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

function setPC(value: number) {
	if (!isValidAddress(value)) {
		throw new Error("Invalid address")
	}
	updateSync(oldCpu => ({
		...oldCpu,
		programCounter: value
	}))
}

function setALU1(value: number | null) {
	if (!isValidSigned8bit(value) && !isValidUnsigned8bit(value)) {
		throw new Error("Invalid value")
	}
	updateSync(oldCpu => ({
		...oldCpu,
		alu1: value
	}))
}

function setALU2(value: number | null) {
	if (!isValidSigned8bit(value) && !isValidUnsigned8bit(value)) {
		throw new Error("Invalid value")
	}
	updateSync(oldCpu => ({
		...oldCpu,
		alu2: value
	}))
}

function setACC(value: number) {
	if (!isValidSigned8bit(value)) {
		throw new Error("Invalid value")
	}
	updateSync(oldCpu => ({
		...oldCpu,
		accumulator: value
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
