import type { ScheduleTasksRequest } from "$lib/execution/action_performer"
import { i16, u16, type I16, type U8 } from "$lib/integer"
import {
	OPCODE_NOP,
	OPCODE_NUMBER_ADD,
	OPCODE_NUMBER_AND,
	OPCODE_NUMBER_CMP,
	OPCODE_NUMBER_DIV,
	OPCODE_NUMBER_HLT,
	OPCODE_NUMBER_JMP,
	OPCODE_NUMBER_JN,
	OPCODE_NUMBER_JNN,
	OPCODE_NUMBER_JNZ,
	OPCODE_NUMBER_JZ,
	OPCODE_NUMBER_LOD,
	OPCODE_NUMBER_MUL,
	OPCODE_NUMBER_NOP,
	OPCODE_NUMBER_NOT,
	OPCODE_NUMBER_STO,
	OPCODE_NUMBER_SUB,
	type Opcode,
} from "$lib/opcode"
import { todo } from "$lib/util/development"
import type { ByteBus, OpcodeBus, WordBus } from "./bus.svelte"

/** State of the arithmetic-logic unit */
export class ArithmeticLogicUnit {
	/** The first operand for the current operation */
	private _operand1: I16
	/** The second operand for the current operation */
	private _operand2: I16
	/** The operation currently selected */
	private _operation: Opcode
	/** The result of the last operation */
	private _result: I16
	/** Value of the status word updated by the last operation */
	private statusWord: U8
	/** The bus from which the first operand is read */
	private operand1Bus: WordBus
	/** The bus from which the second operand is read */
	private operand2Bus: WordBus
	/** The control bus connected to the control unit from which the opcode of the next operation is read */
	private operationBus: OpcodeBus
	/** The bus connected to the accumulator onto which the result of the last operation will be sent */
	private resultBus: WordBus
	/** The bus connected to the status word */
	private statusWordBus: ByteBus

	constructor(
		operand1Bus: WordBus,
		operand2Bus: WordBus,
		outputBus: WordBus,
		statusWordBus: ByteBus,
		operationBus: OpcodeBus,
	) {
		this._operand1 = $state(0 as I16)
		this._operand2 = $state(0 as I16)
		this._operation = $state(OPCODE_NOP)
		this._result = $state(0 as I16)
		this.statusWord = $state(0 as U8)
		this.operand1Bus = operand1Bus
		this.operand2Bus = operand2Bus
		this.resultBus = outputBus
		this.statusWordBus = statusWordBus
		this.operationBus = operationBus
	}

	/** The first operand for the current operation */
	get operand1(): I16 {
		return this._operand1
	}

	/** The second operand for the current operation */
	get operand2(): I16 {
		return this._operand2
	}

	/** The operation currently selected */
	get operation(): Opcode {
		return this._operation
	}

	/** Set the value of the first operand to the value read from the relative bus.
	 * @throws {NoSignalError} */
	readOperand1Signal(): void {
		this._operand1 = i16(this.operand1Bus.readSignalOrThrow())
	}

	/** Set the value of the second operand to the value read from the relative bus.
	 * @throws {NoSignalError} */
	readOperand2Signal(): void {
		this._operand2 = i16(this.operand2Bus.readSignalOrThrow())
	}

	/** Set the value of the selected operation to the value read from the bus connected to the control unit.
	 * @throws {NoSignalError} */
	readOperationSignal(): void {
		this._operation = this.operationBus.readSignalOrThrow()
	}

	/** Send the value of the result of the last operation on the bus connected to the accumulator */
	sendResultSignal(): void {
		this.resultBus.sendSignal(u16(this._result))
	}

	/** Read the value of the status word from the bus connected to its register.
	 * @throws {NoSignalError} */
	readStatusWordSignal(): void {
		this.statusWord = this.statusWordBus.readSignalOrThrow()
	}

	/** Send the value of the status word updated by the last operation on the bus connected to the status word register */
	sendStatusWordSignal(): void {
		this.statusWordBus.sendSignal(this.statusWord)
	}

	// TODO: determine how to implement this
	executeOperation(): ScheduleTasksRequest {
		switch (this._operation.numeric) {
			case OPCODE_NUMBER_NOP:
				break

			case OPCODE_NUMBER_HLT:
				break

			case OPCODE_NUMBER_JMP:
				break

			case OPCODE_NUMBER_JZ:
				break

			case OPCODE_NUMBER_JNZ:
				break

			case OPCODE_NUMBER_JN:
				break

			case OPCODE_NUMBER_JNN:
				break

			case OPCODE_NUMBER_LOD:
				break

			case OPCODE_NUMBER_STO:
				break

			case OPCODE_NUMBER_ADD:
				break

			case OPCODE_NUMBER_SUB:
				break

			case OPCODE_NUMBER_MUL:
				break

			case OPCODE_NUMBER_DIV:
				break

			case OPCODE_NUMBER_AND:
				break

			case OPCODE_NUMBER_CMP:
				break

			case OPCODE_NUMBER_NOT:
				break
		}
		todo("to be completed")
	}
}
