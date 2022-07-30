import { writable } from "svelte/store"
import Instruction from "../instruction/Instruction"
import { parseSymbolic } from "../instruction/instructionParser"
import { Operators } from "../instruction/Opcode"
import BinaryValue from "../util/BinaryValue"
import { FIRST_ADDRESS, WORD_SIZE } from "../util/ramUtil"

export const instructionRegister = writable<Instruction>(parseSymbolic("NOP"))
export const programCounter = writable<BinaryValue>(new BinaryValue(8, FIRST_ADDRESS))
export const increment = writable<BinaryValue>(new BinaryValue(8, WORD_SIZE))
export const alu1 = writable<BinaryValue>(new BinaryValue(16, 0))
export const alu2 = writable<BinaryValue>(new BinaryValue(16, 0))
export const aluOperation = writable<Operators>("")
export const aluResult = writable<BinaryValue>(new BinaryValue(16, 0))
export const accumulator = writable<BinaryValue>(new BinaryValue(16, 0))
export const zeroFlag = writable<boolean>(true)
export const negativeFlag = writable<boolean>(false)
export const isJumping = writable<boolean>(false)
export const isHalting = writable<boolean>(false)

export function reset() {
	instructionRegister.set(parseSymbolic("NOP"))
	programCounter.set(new BinaryValue(8, FIRST_ADDRESS))
	increment.set(new BinaryValue(8, WORD_SIZE))
	alu1.set(new BinaryValue(16, 0))
	alu2.set(new BinaryValue(16, 0))
	aluOperation.set("")
	aluResult.set(new BinaryValue(16, 0))
	accumulator.set(new BinaryValue(16, 0))
	zeroFlag.set(true)
	negativeFlag.set(false)
	isJumping.set(false)
	isHalting.set(false)
}

export default {
	instructionRegister,
	programCounter,
	increment,
	alu1,
	alu2,
	aluOperation,
	aluResult,
	accumulator,
	zeroFlag,
	negativeFlag,
	isJumping,
	isHalting,
	reset
}
