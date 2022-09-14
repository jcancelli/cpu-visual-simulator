import { writable, Writable } from "../util/customStores"
import Instruction from "../instruction/Instruction"
import { Operators } from "../instruction/Opcode"
import BinaryValue from "./BinaryValue"
import { FIRST_ADDRESS, WORD_SIZE } from "../util/ramUtil"

/** Class that represents the CPU state */
export default class Cpu {
	public readonly instructionRegister: Writable<Instruction>
	public readonly programCounter: Writable<BinaryValue>
	public readonly increment: Writable<BinaryValue>
	public readonly alu1: Writable<BinaryValue>
	public readonly alu2: Writable<BinaryValue>
	public readonly aluOperation: Writable<Operators>
	public readonly aluResult: Writable<BinaryValue>
	public readonly accumulator: Writable<BinaryValue>
	public readonly zeroFlag: Writable<boolean>
	public readonly negativeFlag: Writable<boolean>
	public readonly isJumping: Writable<boolean>
	public readonly isHalting: Writable<boolean>

	constructor() {
		this.instructionRegister = writable(Instruction.NOP)
		this.programCounter = writable(new BinaryValue(8, FIRST_ADDRESS))
		this.increment = writable<BinaryValue>(new BinaryValue(8, WORD_SIZE))
		this.alu1 = writable<BinaryValue>(new BinaryValue(16, 0))
		this.alu2 = writable<BinaryValue>(new BinaryValue(16, 0))
		this.aluOperation = writable<Operators>("")
		this.aluResult = writable<BinaryValue>(new BinaryValue(16, 0))
		this.accumulator = writable<BinaryValue>(new BinaryValue(16, 0))
		this.zeroFlag = writable<boolean>(true)
		this.negativeFlag = writable<boolean>(false)
		this.isJumping = writable<boolean>(false)
		this.isHalting = writable<boolean>(false)
	}

	/** Resets all cpu values to their default values */
	reset(): void {
		this.instructionRegister.set(Instruction.NOP)
		this.programCounter.set(new BinaryValue(8, FIRST_ADDRESS))
		this.increment.set(new BinaryValue(8, WORD_SIZE))
		this.alu1.set(new BinaryValue(16, 0))
		this.alu2.set(new BinaryValue(16, 0))
		this.aluOperation.set("")
		this.aluResult.set(new BinaryValue(16, 0))
		this.accumulator.set(new BinaryValue(16, 0))
		this.zeroFlag.set(true)
		this.negativeFlag.set(false)
		this.isJumping.set(false)
		this.isHalting.set(false)
	}
}
