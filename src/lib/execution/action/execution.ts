import { ActionType } from "$lib/types/action"
import { ExecutionStep as Step } from "$lib/types/execution"
import { Action } from "../task"

/** Base class for all actions regarding execution */
export abstract class ExecutionAction extends Action {}

/** Signal the start of a new execution step */
export class StartStepAction extends ExecutionAction {
	/** The step now executing */
	public readonly step: Step

	constructor(step: Step) {
		super()
		this.step = step
	}

	override get actionType(): ActionType {
		return ActionType.START_STEP
	}
}

/** Signal the end of the currently executing step */
export class EndStepAction extends ExecutionAction {
	override get actionType(): ActionType {
		return ActionType.END_STEP
	}
}

/** Signal the end of the currently executing instruction */
export class EndInstructionAction extends ExecutionAction {
	override get actionType(): ActionType {
		return ActionType.END_INSTRUCTION
	}
}

/** Signal the end of the currently executing program */
export class EndProgramAction extends ExecutionAction {
	override get actionType(): ActionType {
		return ActionType.END_PROGRAM
	}
}

/** Instances of {@link StartStepAction} indexed by their step.
 * Stored in a constant so that they can be reused without instancing new objects */
const START_STEP_ACTIONS = {
	[Step.PROGRAM_COUNTER_TO_MEMORY]: new StartStepAction(Step.PROGRAM_COUNTER_TO_MEMORY),
	[Step.MEMORY_TO_INSTRUCTION_REGISTER]: new StartStepAction(Step.MEMORY_TO_INSTRUCTION_REGISTER),
	[Step.DECODE_OPCODE]: new StartStepAction(Step.DECODE_OPCODE),
	[Step.INVALID_OPCODE]: new StartStepAction(Step.INVALID_OPCODE),
	[Step.NO_OP]: new StartStepAction(Step.NO_OP),
	[Step.HALT]: new StartStepAction(Step.HALT),
	[Step.SET_ALU_OPERATION]: new StartStepAction(Step.SET_ALU_OPERATION),
	[Step.SET_ADDRESSING_MODE]: new StartStepAction(Step.SET_ADDRESSING_MODE),
	[Step.DIVISION_BY_ZERO]: new StartStepAction(Step.DIVISION_BY_ZERO),
	[Step.INCREMENT_PROGRAM_COUNTER]: new StartStepAction(Step.INCREMENT_PROGRAM_COUNTER),
	[Step.LAST_ADDRESS_REACHED]: new StartStepAction(Step.LAST_ADDRESS_REACHED),
	[Step.LOAD_OPERAND_1_FROM_ACCUMULATOR]: new StartStepAction(
		Step.LOAD_OPERAND_1_FROM_ACCUMULATOR,
	),
	[Step.LOAD_OPERAND_2_FROM_INSTRUCTION_REGISTER]: new StartStepAction(
		Step.LOAD_OPERAND_2_FROM_INSTRUCTION_REGISTER,
	),
	[Step.INSTRUCTION_REGISTER_OPERAND_TO_MEMORY]: new StartStepAction(
		Step.INSTRUCTION_REGISTER_OPERAND_TO_MEMORY,
	),
	[Step.LOAD_OPERAND_2_FROM_MEMORY]: new StartStepAction(Step.LOAD_OPERAND_2_FROM_MEMORY),
	[Step.OPERAND_TO_PROGRAM_COUNTER]: new StartStepAction(Step.OPERAND_TO_PROGRAM_COUNTER),
	[Step.CHECK_STATUS_WORD_FLAG]: new StartStepAction(Step.CHECK_STATUS_WORD_FLAG),
	[Step.SIGNAL_MEMORY_FETCH]: new StartStepAction(Step.SIGNAL_MEMORY_FETCH),
	[Step.SIGNAL_MEMORY_READ]: new StartStepAction(Step.SIGNAL_MEMORY_READ),
	[Step.SIGNAL_MEMORY_WRITE]: new StartStepAction(Step.SIGNAL_MEMORY_WRITE),
	[Step.EXECUTE_ALU_OPERATION]: new StartStepAction(Step.EXECUTE_ALU_OPERATION),
	[Step.UPDATE_STATUS_WORD]: new StartStepAction(Step.UPDATE_STATUS_WORD),
	[Step.ACCUMULATOR_STORED_TO_MEMORY]: new StartStepAction(Step.ACCUMULATOR_STORED_TO_MEMORY),
} as const satisfies {
	[S in Step]: StartStepAction
}

/** Signal the start of a new execution step */
export function startStep(step: Step): StartStepAction {
	return START_STEP_ACTIONS[step]
}

/** Instance of {@link EndStepAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endStep = new EndStepAction()

/** Instance of {@link EndInstructionAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endInstruction = new EndInstructionAction()

/** Instance of {@link EndProgramAction}.
 * Stored in a constant so that it can be reused without instancing new objects */
export const endProgram = new EndProgramAction()
