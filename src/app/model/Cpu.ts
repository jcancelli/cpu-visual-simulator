import { writable, Writable } from "../util/customStores"
import Instruction from "../model/Instruction"
import { Operators } from "../model/InstructionSet"
import BinaryValue from "./BinaryValue"
import { FIRST_ADDRESS } from "../util/ram"
import { WORD_SIZE } from "../util/cpu"

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
	public reset(): void {
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

	public set(component: CpuComponent, value: Instruction | BinaryValue | Operators | boolean): void {
		switch (component) {
			case CpuComponent.IR:
				this.instructionRegister.set(value as Instruction)
				break
			case CpuComponent.PC:
				this.programCounter.set(value as BinaryValue)
				break
			case CpuComponent.INC:
				this.increment.set(value as BinaryValue)
				break
			case CpuComponent.ALU1:
				this.alu1.set(value as BinaryValue)
				break
			case CpuComponent.ALU2:
				this.alu2.set(value as BinaryValue)
				break
			case CpuComponent.ALU_OP:
				this.aluOperation.set(value as Operators)
				break
			case CpuComponent.ALU_RESULT:
				this.aluResult.set(value as BinaryValue)
				break
			case CpuComponent.ACC:
				this.accumulator.set(value as BinaryValue)
				break
			case CpuComponent.SW_Z:
				this.zeroFlag.set(value as boolean)
				break
			case CpuComponent.SW_N:
				this.negativeFlag.set(value as boolean)
				break
			case CpuComponent.HALTING:
				this.isHalting.set(value as boolean)
				break
			case CpuComponent.JUMPING:
				this.isJumping.set(value as boolean)
				break
		}
	}
}

export enum CpuComponent {
	IR = "IR",
	PC = "PC",
	INC = "INC",
	ALU1 = "ALU1",
	ALU2 = "ALU2",
	ALU_OP = "ALU_OP",
	ALU_RESULT = "ALU_RESULT",
	ACC = "ACC",
	SW_Z = "SW_Z",
	SW_N = "SW_N",
	HALTING = "HALTING",
	JUMPING = "JUMPING"
}
