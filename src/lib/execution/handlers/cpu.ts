import type { WordAddressRegister } from "$lib/register/word_address"
import { ActionType } from "$lib/types/action"
import { assert, unreachable } from "$lib/util/development"
import type { ActionHandler, TaskSystemProxy } from "../action_handler"
import {
	type IncrementPCOrHaltProgramAction,
	type IncrementAddressAction,
	type ResetProgramCounterAction,
	type DecodeOpcodeAction,
	executeOpcode,
	ExecuteOpcodeAction,
	ExecuteALUOperationAction,
	SetMemoryOperationAction,
	ConditionalJumpAction,
	incrementProgramCounterOrHaltProgram,
} from "../action/cpu"
import type { ArithmeticLogicUnit, ControlUnit, Decoder } from "$lib/state/cpu"
import { getImmediateFlag, getOpcodeByNumeric, OpcodeNumeric } from "$lib/types/opcode"
import { i16, u16, type I16 } from "$lib/types/integer"
import { NEGATIVE_FLAG_BIT, STATUS_WORD_NO_FLAGS, ZERO_FLAG_BIT } from "$lib/types/status_word"
import {
	FIRST_ADDRESS,
	LAST_WORD_ADDRESS,
	WORD_ALIGNMENT,
	type WordAlignedAddress,
} from "$lib/types/address"
import {
	INVALID_OPCODE_WORKFLOW,
	NOP_WORKFLOW,
	HLT_WORKFLOW,
	JMP_WORKFLOW,
	JZ_WORKFLOW,
	JNZ_WORKFLOW,
	JN_WORKFLOW,
	JNN_WORKFLOW,
	LOD_WORKFLOW,
	STO_WORKFLOW,
	ADD_WORKFLOW,
	SUB_WORKFLOW,
	MUL_WORKFLOW,
	DIV_WORKFLOW,
	AND_WORKFLOW,
	CMP_WORKFLOW,
	NOT_WORKFLOW,
	DIVISION_BY_ZERO_WORKFLOW,
	INCREMENT_PROGRAM_COUNTER_WORKFLOW,
	LAST_ADDRESS_REACHED_WORKFLOW,
	OPERAND_TO_PROGRAM_COUNTER_WORKFLOW,
} from "../workflows"
import { Addressing } from "$lib/types/cpu"
import type { StatusWordRegister } from "$lib/register/status_word"
import { endInstruction } from "../action/execution"

/** {@link ActionHandler} for {@link DecodeOpcodeAction} */
export class DecodeOpcodeActionHandler implements ActionHandler<DecodeOpcodeAction> {
	private controlUnit: ControlUnit
	private decoder: Decoder

	constructor(controlUnit: ControlUnit, decoder: Decoder) {
		this.controlUnit = controlUnit
		this.decoder = decoder
	}

	get actionType(): ActionType {
		return ActionType.DECODE_OPCODE
	}

	handle(_: DecodeOpcodeAction, taskSystem: TaskSystemProxy): void {
		const input = this.decoder.input.unsigned
		const opcode = getOpcodeByNumeric(input)
		const immediateFlag = getImmediateFlag(input)
		if (opcode === undefined) {
			taskSystem.submit(...INVALID_OPCODE_WORKFLOW)
		} else {
			this.decoder.decodedOpcode.unsigned = opcode.numeric
			this.decoder.decodedImmediateFlag = immediateFlag
			this.controlUnit.addressingMode.value =
				immediateFlag ? Addressing.IMMEDIATE : Addressing.DIRECT
			taskSystem.submit(executeOpcode)
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

	handle(_: ExecuteOpcodeAction, taskSystem: TaskSystemProxy): void {
		switch (this.decoder.decodedOpcode.opcode.numeric) {
			case OpcodeNumeric.NOP:
				taskSystem.submit(...NOP_WORKFLOW)
				break

			case OpcodeNumeric.HLT:
				taskSystem.submit(...HLT_WORKFLOW)
				break

			case OpcodeNumeric.JMP:
				taskSystem.submit(...JMP_WORKFLOW)
				break

			case OpcodeNumeric.JZ:
				taskSystem.submit(...JZ_WORKFLOW)
				break

			case OpcodeNumeric.JNZ:
				taskSystem.submit(...JNZ_WORKFLOW)
				break

			case OpcodeNumeric.JN:
				taskSystem.submit(...JN_WORKFLOW)
				break

			case OpcodeNumeric.JNN:
				taskSystem.submit(...JNN_WORKFLOW)
				break

			case OpcodeNumeric.LOD:
				taskSystem.submit.submit(...LOD_WORKFLOW)
				break

			case OpcodeNumeric.STO:
				taskSystem.submit(...STO_WORKFLOW)
				break

			case OpcodeNumeric.ADD:
				taskSystem.submit(...ADD_WORKFLOW)
				break

			case OpcodeNumeric.SUB:
				taskSystem.submit(...SUB_WORKFLOW)
				break

			case OpcodeNumeric.MUL:
				taskSystem.submit(...MUL_WORKFLOW)
				break

			case OpcodeNumeric.DIV:
				taskSystem.submit(...DIV_WORKFLOW)
				break

			case OpcodeNumeric.AND:
				taskSystem.submit(...AND_WORKFLOW)
				break

			case OpcodeNumeric.CMP:
				taskSystem.submit(...CMP_WORKFLOW)
				break

			case OpcodeNumeric.NOT:
				taskSystem.submit(...NOT_WORKFLOW)
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

	handle(_: ExecuteALUOperationAction, taskSystem: TaskSystemProxy): void {
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
					taskSystem.submit(...DIVISION_BY_ZERO_WORKFLOW)
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

/** {@link ActionHandler} for {@link ConditionalJumpAction} */
export class ConditionalJumpActionHandler implements ActionHandler<ConditionalJumpAction> {
	private decoder: Decoder
	private statusWord: StatusWordRegister

	constructor(decoder: Decoder, statusWord: StatusWordRegister) {
		this.decoder = decoder
		this.statusWord = statusWord
	}

	get actionType(): ActionType {
		return ActionType.CONDITIONAL_JUMP
	}

	handle(_: ConditionalJumpAction, taskSystem: TaskSystemProxy): void {
		let isJumping: boolean
		switch (this.decoder.decodedOpcode.opcode.numeric) {
			case OpcodeNumeric.JZ:
				isJumping = this.statusWord.zeroFlag
				break

			case OpcodeNumeric.JNZ:
				isJumping = !this.statusWord.zeroFlag
				break

			case OpcodeNumeric.JN:
				isJumping = this.statusWord.negativeFlag
				break

			case OpcodeNumeric.JNN:
				isJumping = !this.statusWord.negativeFlag
				break

			default:
				unreachable()
		}
		if (isJumping) {
			taskSystem.submit(
				...OPERAND_TO_PROGRAM_COUNTER_WORKFLOW, //
				endInstruction,
			)
		} else {
			taskSystem.submit(
				incrementProgramCounterOrHaltProgram, //
				endInstruction,
			)
		}
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

	handle(_: IncrementPCOrHaltProgramAction, taskSystem: TaskSystemProxy): void {
		if (this.programCounter.address === LAST_WORD_ADDRESS) {
			taskSystem.submit(...LAST_ADDRESS_REACHED_WORKFLOW)
		} else {
			taskSystem.submit(...INCREMENT_PROGRAM_COUNTER_WORKFLOW)
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
		assert(this.programCounterIncrementer.address < LAST_WORD_ADDRESS)
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
		this.programCounter.address = FIRST_ADDRESS as WordAlignedAddress
	}
}
