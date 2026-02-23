import type { ScheduleTasksRequest } from "$lib/execution/action_performer"
import { type I16, type U8 } from "$lib/integer"
import { getOpcodeByNumericOrThrow, OPCODE_NOP, OpcodeNumeric, type Opcode } from "$lib/opcode"
import { todo } from "$lib/util/development"
import type { Bus } from "./bus.svelte"

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
	private operand1Bus: Bus<16>
	/** The bus from which the second operand is read */
	private operand2Bus: Bus<16>
	/** The control bus connected to the control unit from which the opcode of the next operation is read */
	private operationBus: Bus<8>
	/** The bus connected to the accumulator onto which the result of the last operation will be sent */
	private resultBus: Bus<16>
	/** The bus connected to the status word */
	private statusWordBus: Bus<8>

	constructor(
		operand1Bus: Bus<16>,
		operand2Bus: Bus<16>,
		outputBus: Bus<16>,
		statusWordBus: Bus<8>,
		operationBus: Bus<8>,
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
		this._operand1 = this.operand1Bus.readSignalSignedOrThrow()
	}

	/** Set the value of the second operand to the value read from the relative bus.
	 * @throws {NoSignalError} */
	readOperand2Signal(): void {
		this._operand2 = this.operand2Bus.readSignalSignedOrThrow()
	}

	/** Set the value of the selected operation to the value read from the bus connected to the control unit.
	 * @throws {NoSignalError}
	 * @throws {InvalidNumericOpcodeError} */
	readOperationSignal(): void {
		const signal = this.operationBus.readSignalUnsignedOrThrow()
		this._operation = getOpcodeByNumericOrThrow(signal)
	}

	/** Send the value of the result of the last operation on the bus connected to the accumulator */
	sendResultSignal(): void {
		this.resultBus.sendSignalSigned(this._result)
	}

	/** Read the value of the status word from the bus connected to its register.
	 * @throws {NoSignalError} */
	readStatusWordSignal(): void {
		this.statusWord = this.statusWordBus.readSignalUnsignedOrThrow()
	}

	/** Send the value of the status word updated by the last operation on the bus connected to the status word register */
	sendStatusWordSignal(): void {
		this.statusWordBus.sendSignalUnsigned(this.statusWord)
	}

	// TODO: determine how to implement this
	executeOperation(): ScheduleTasksRequest {
		switch (this._operation.numeric) {
			case OpcodeNumeric.NOP:
			case OpcodeNumeric.HLT:
			case OpcodeNumeric.JMP:
			case OpcodeNumeric.JZ:
			case OpcodeNumeric.JNZ:
			case OpcodeNumeric.JN:
			case OpcodeNumeric.JNN:
			case OpcodeNumeric.LOD:
			case OpcodeNumeric.STO:
			case OpcodeNumeric.ADD:
			case OpcodeNumeric.SUB:
			case OpcodeNumeric.MUL:
			case OpcodeNumeric.DIV:
			case OpcodeNumeric.AND:
			case OpcodeNumeric.CMP:
			case OpcodeNumeric.NOT:
		}
		todo("to be completed")
	}
}
