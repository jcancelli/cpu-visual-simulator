import type { WordAddressRegister } from "$lib/register/word_address"
import { ActionType } from "$lib/types/action"
import {
	MAX_WORD_ADDRESS,
	MIN_ADDRESS,
	WORD_ALIGNMENT,
	type WordAlignedAddress,
} from "$lib/types/address"
import { assert, unreachable } from "$lib/util/development"
import type { ActionHandler, SubmitTasksFunction } from "../action_handler"
import {
	type IncrementPCOrHaltProgramAction,
	type IncrementAddressAction,
	type ResetProgramCounterAction,
	type DecodeOpcodeAction,
	executeOpcode,
	ExecuteOpcodeAction,
	ExecuteALUOperationAction,
	SetMemoryOperationAction,
} from "../action/cpu"
import {
	ADD_ACTIONS,
	AND_ACTIONS,
	CMP_ACTIONS,
	DIV_ACTIONS,
	DIVISION_BY_ZERO_TASKS,
	HLT_ACTIONS,
	INCREMENT_PROGRAM_COUNTER_ACTIONS,
	INVALID_OPCODE_ACTIONS,
	JMP_ACTIONS,
	JN_ACTIONS,
	JNN_ACTIONS,
	JNZ_ACTIONS,
	JZ_ACTIONS,
	LOD_ACTIONS,
	MAX_ADDRESS_REACHED_ACTIONS,
	MUL_ACTIONS,
	NOP_ACTIONS,
	NOT_ACTIONS,
	STO_ACTIONS,
	SUB_ACTIONS,
} from "../steps_actions"
import type { ArithmeticLogicUnit, ControlUnit, Decoder } from "$lib/state/cpu"
import { getOpcodeByNumeric, OpcodeNumeric } from "$lib/types/opcode"
import { i16, u16, type I16 } from "$lib/types/integer"
import { NEGATIVE_FLAG_BIT, STATUS_WORD_NO_FLAGS, ZERO_FLAG_BIT } from "$lib/types/status_word"

/** {@link ActionHandler} for {@link DecodeOpcodeAction} */
export class DecodeOpcodeActionHandler implements ActionHandler<DecodeOpcodeAction> {
	private decoder: Decoder

	constructor(decoder: Decoder) {
		this.decoder = decoder
	}

	get actionType(): ActionType {
		return ActionType.DECODE_OPCODE
	}

	handle(_: DecodeOpcodeAction, submitTasks: SubmitTasksFunction): void {
		const opcode = getOpcodeByNumeric(this.decoder.input.unsigned)
		if (opcode === undefined) {
			submitTasks(...INVALID_OPCODE_ACTIONS)
		} else {
			this.decoder.decodedOpcode.unsigned = this.decoder.input.unsigned
			submitTasks(executeOpcode)
		}
	}
}

/** {@link ActionHandler} for {@link ExecuteOpcodeAction} */
export class ExecuteOpcodeActionHandler implements ActionHandler<ExecuteOpcodeAction> {
	private decoder: Decoder

	constructor(decoder: Decoder) {
		this.decoder = decoder
	}

	get actionType(): ActionType {
		return ActionType.EXECUTE_OPCODE
	}

	handle(_: ExecuteOpcodeAction, submitTasks: SubmitTasksFunction): void {
		switch (this.decoder.decodedOpcode.opcode.numeric) {
			case OpcodeNumeric.NOP:
				submitTasks(...NOP_ACTIONS)
				break

			case OpcodeNumeric.HLT:
				submitTasks(...HLT_ACTIONS)
				break

			case OpcodeNumeric.JMP:
				submitTasks(...JMP_ACTIONS)
				break

			case OpcodeNumeric.JZ:
				submitTasks(...JZ_ACTIONS)
				break

			case OpcodeNumeric.JNZ:
				submitTasks(...JNZ_ACTIONS)
				break

			case OpcodeNumeric.JN:
				submitTasks(...JN_ACTIONS)
				break

			case OpcodeNumeric.JNN:
				submitTasks(...JNN_ACTIONS)
				break

			case OpcodeNumeric.LOD:
				submitTasks(...LOD_ACTIONS)
				break

			case OpcodeNumeric.STO:
				submitTasks(...STO_ACTIONS)
				break

			case OpcodeNumeric.ADD:
				submitTasks(...ADD_ACTIONS)
				break

			case OpcodeNumeric.SUB:
				submitTasks(...SUB_ACTIONS)
				break

			case OpcodeNumeric.MUL:
				submitTasks(...MUL_ACTIONS)
				break

			case OpcodeNumeric.DIV:
				submitTasks(...DIV_ACTIONS)
				break

			case OpcodeNumeric.AND:
				submitTasks(...AND_ACTIONS)
				break

			case OpcodeNumeric.CMP:
				submitTasks(...CMP_ACTIONS)
				break

			case OpcodeNumeric.NOT:
				submitTasks(...NOT_ACTIONS)
				break

			default:
				unreachable()
		}
	}
}

/** {@link ActionHandler} for {@link ExecuteALUOperationAction} */
export class ExecuteALUOperationActionHandler implements ActionHandler<ExecuteALUOperationAction> {
	private alu: ArithmeticLogicUnit

	constructor(alu: ArithmeticLogicUnit) {
		this.alu = alu
	}

	get actionType(): ActionType {
		return ActionType.EXECUTE_ALU_OPERATION
	}

	handle(_: ExecuteALUOperationAction, submitTasks: SubmitTasksFunction): void {
		const op1 = this.alu.operand1.signed
		const op2 = this.alu.operand2.signed
		let result: I16

		switch (this.alu.operation.opcode.numeric) {
			case OpcodeNumeric.LOD:
				result = op2
				break

			case OpcodeNumeric.ADD:
				result = i16(op1 + op2)
				break

			case OpcodeNumeric.SUB:
				result = i16(op1 - op2)
				break

			case OpcodeNumeric.MUL:
				result = i16(op1 * op2)
				break

			case OpcodeNumeric.DIV:
				if (op2 === 0) {
					submitTasks(...DIVISION_BY_ZERO_TASKS)
					return
				}
				result = i16(op1 / op2)
				break

			case OpcodeNumeric.AND:
				result = i16(u16(op1) & u16(op2))
				break

			case OpcodeNumeric.CMP:
				result = i16(op1 - op2)
				break

			case OpcodeNumeric.NOT:
				result = i16(~u16(op2))
				break

			default:
				unreachable()
		}
		this.alu.result.signed = result
		if (result > 0) {
			this.alu.statusWord.value = STATUS_WORD_NO_FLAGS
		} else if (result < 0) {
			this.alu.statusWord.value = NEGATIVE_FLAG_BIT
		} else {
			this.alu.statusWord.value = ZERO_FLAG_BIT
		}
	}
}

/** {@link ActionHandler} for {@link SetMemoryOperationAction} */
export class SetMemoryOperationActionHandler implements ActionHandler<SetMemoryOperationAction> {
	private controlUnit: ControlUnit

	constructor(controlUnit: ControlUnit) {
		this.controlUnit = controlUnit
	}

	get actionType(): ActionType {
		return ActionType.SET_MEMORY_OPERATION
	}

	handle(action: SetMemoryOperationAction): void {
		this.controlUnit.memoryOperation.value = action.operation
	}
}

/** {@link ActionHandler} for {@link IncrementPCOrHaltProgramAction} */
export class IncrementPCOrHaltProgramActionHandler implements ActionHandler<IncrementPCOrHaltProgramAction> {
	private programCounter: WordAddressRegister

	constructor(programCounter: WordAddressRegister) {
		this.programCounter = programCounter
	}

	get actionType(): ActionType {
		return ActionType.INCREMENT_PC_OR_HALT_PROGRAM
	}

	handle(_: IncrementPCOrHaltProgramAction, submitTasks: SubmitTasksFunction): void {
		if (this.programCounter.address === MAX_WORD_ADDRESS) {
			submitTasks(...MAX_ADDRESS_REACHED_ACTIONS)
		} else {
			submitTasks(...INCREMENT_PROGRAM_COUNTER_ACTIONS)
		}
	}
}

/** {@link ActionHandler} for {@link IncrementAddressAction} */
export class IncrementAddressActionHandler implements ActionHandler<IncrementAddressAction> {
	private programCounterIncrementer: WordAddressRegister

	constructor(programCounterIncrementer: WordAddressRegister) {
		this.programCounterIncrementer = programCounterIncrementer
	}

	get actionType(): ActionType {
		return ActionType.INCREMENT_ADDRESS
	}

	handle(): void {
		assert(this.programCounterIncrementer.address < MAX_WORD_ADDRESS)
		this.programCounterIncrementer.unsigned += WORD_ALIGNMENT
	}
}

/** {@link ActionHandler} for {@link ResetProgramCounterAction} */
export class ResetProgramCounterActionHandler implements ActionHandler<ResetProgramCounterAction> {
	private programCounter: WordAddressRegister

	constructor(programCounter: WordAddressRegister) {
		this.programCounter = programCounter
	}

	get actionType(): ActionType {
		return ActionType.RESET_PROGRAM_COUNTER
	}

	handle(): void {
		this.programCounter.address = MIN_ADDRESS as WordAlignedAddress
	}
}
