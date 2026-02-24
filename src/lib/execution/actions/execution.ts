import { ActionType } from "$lib/types/action"
import { Action } from "../task"

/** Base class for all actions regarding execution */
export abstract class ExecutionAction extends Action {}

/** Halt the execution */
export class HaltExecutionAction extends ExecutionAction {
	constructor() {
		super(ActionType.HALT_EXECUTION)
	}
}

/** Signal the end of the currently executing step */
export class EndStepAction extends ExecutionAction {
	constructor() {
		super(ActionType.END_STEP)
	}
}

/** Signal the end of the currently executing instruction */
export class EndInstructionAction extends ExecutionAction {
	constructor() {
		super(ActionType.END_INSTRUCTION)
	}
}

/** Signal the end of the currently executing program */
export class EndProgramAction extends ExecutionAction {
	constructor() {
		super(ActionType.END_PROGRAM)
	}
}

/** Instance of {@link HaltExecutionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const haltExecution = new HaltExecutionAction()

/** Instance of {@link EndStepAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endStep = new EndStepAction()

/** Instance of {@link EndInstructionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endInstruction = new EndInstructionAction()

/** Instance of {@link EndProgramAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endProgram = new EndProgramAction()
