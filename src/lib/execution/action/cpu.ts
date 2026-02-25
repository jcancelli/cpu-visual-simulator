import { ActionType } from "$lib/types/action"
import { MemoryOperation } from "$lib/types/memory"
import { Action } from "../task"

/** Base class for an action regarding the {@link CPU} */
export abstract class CPUAction extends Action {}

/** Decode the opcode read by the decoder */
export class DecodeOpcodeAction extends CPUAction {
	override get actionType(): ActionType {
		return ActionType.DECODE_OPCODE
	}
}

/** Execute the opcode decoded by the decoder */
export class ExecuteOpcodeAction extends CPUAction {
	override get actionType(): ActionType {
		return ActionType.EXECUTE_OPCODE
	}
}

/** Execute whatever instruction the ALU was set to perform */
export class ExecuteALUOperationAction extends CPUAction {
	override get actionType(): ActionType {
		return ActionType.EXECUTE_ALU_OPERATION
	}
}

/** Instruct the control unit on what operation it sould signal to the memory next */
export class SetMemoryOperationAction extends CPUAction {
	/** The memory operation that should be signaled to the memory */
	public readonly operation: MemoryOperation

	constructor(operation: MemoryOperation) {
		super()
		this.operation = operation
	}

	override get actionType(): ActionType {
		return ActionType.SET_MEMORY_OPERATION
	}
}

/** Increment the program counter or halt execution if the end of the program was reached */
export class IncrementAddressAction extends CPUAction {
	override get actionType(): ActionType {
		return ActionType.INCREMENT_ADDRESS
	}
}

/** Increment the value stored in the program counter incrementer */
export class IncrementIncrementerAction extends CPUAction {
	override get actionType(): ActionType {
		return ActionType.INCREMENT_INCREMENTER
	}
}

/** Reset the program counter to the first address */
export class ResetProgramCounterAction extends CPUAction {
	override get actionType(): ActionType {
		return ActionType.RESET_PROGRAM_COUNTER
	}
}

/** Instance of {@link DecodeOpcodeAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const decodeOpcode = new DecodeOpcodeAction()

/** Instance of {@link ExecuteOpcodeAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const executeOpcode = new ExecuteOpcodeAction()

/** Instance of {@link ExecuteALUOperationAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const executeALUOperation = new ExecuteALUOperationAction()

/** Instance of {@link SetMemoryOperationAction} for a {@link MemoryOperation.FETCH} operation.
 * Stored in a constant so that it can be reused without instancing new objects */
export const setMemoryFetchOperation = new SetMemoryOperationAction(MemoryOperation.FETCH)

/** Instance of {@link SetMemoryOperationAction} for a {@link MemoryOperation.READ} operation.
 * Stored in a constant so that it can be reused without instancing new objects */
export const setMemoryReadOperation = new SetMemoryOperationAction(MemoryOperation.READ)

/** Instance of {@link SetMemoryOperationAction} for a {@link MemoryOperation.WRITE} operation.
 * Stored in a constant so that it can be reused without instancing new objects */
export const setMemoryWriteOperation = new SetMemoryOperationAction(MemoryOperation.WRITE)

/** Instance of {@link IncrementAddressAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const incrementAddress = new IncrementAddressAction()

/** Instance of {@link IncrementIncrementerAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const incrementIncrementer = new IncrementIncrementerAction()

/** Instance of {@link ResetProgramCounterAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const resetProgramCounter = new ResetProgramCounterAction()
