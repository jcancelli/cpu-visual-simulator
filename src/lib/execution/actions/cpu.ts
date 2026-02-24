import { ActionType } from "$lib/types/action"
import { MemoryOperation } from "$lib/types/memory"
import { Action } from "../task"

/** Base class for an action regarding the {@link CPU} */
export abstract class CPUAction extends Action {}

/** Decode the opcode read by the decoder */
export class DecodeOpcodeAction extends CPUAction {
	constructor() {
		super(ActionType.DECODE_OPCODE)
	}
}

/** Execute the opcode decoded by the decoder */
export class ExecuteOpcodeAction extends CPUAction {
	constructor() {
		super(ActionType.EXECUTE_OPCODE)
	}
}

/** Execute whatever instruction the ALU was set to perform */
export class ExecuteALUOperationAction extends CPUAction {
	constructor() {
		super(ActionType.EXECUTE_ALU_OPERATION)
	}
}

/** Instruct the control unit on what operation it sould signal to the memory next */
export class SetMemoryOperationAction extends CPUAction {
	/** The memory operation that should be signaled to the memory */
	public readonly operation: MemoryOperation

	constructor(operation: MemoryOperation) {
		super(ActionType.SET_MEMORY_OPERATION)
		this.operation = operation
	}
}

/** Increment the program counter or halt execution if the end of the program was reached */
export class IncrementProgramCounterAction extends CPUAction {
	constructor() {
		super(ActionType.INCREMENT_PROGRAM_COUNTER)
	}
}

/** Reset the program counter to the first address */
export class ResetProgramCounterAction extends CPUAction {
	constructor() {
		super(ActionType.RESET_PROGRAM_COUNTER)
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

/** Instance of {@link IncrementProgramCounterAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const incrementProgramCounter = new IncrementProgramCounterAction()

/** Instance of {@link ResetProgramCounterAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const resetProgramCounter = new ResetProgramCounterAction()
