/** Named breakpoints of the execution. These steps have a textual description displayed in the step description
 * box UI element and a text to speech sentence associated to them.
 * If the {@link Execution} {@link ExecutionSteppingMode|stepping mode} is set to {@link ExecutionSteppingMode.STEP}, every time the end
 * of the step is signaled the execution is paused */
export enum ExecutionStep {
	PROGRAM_COUNTER_TO_ADDRESS_BUS,
	MEMORY_TO_INSTRUCTION_REGISTER,
	DECODE_OPCODE,
	INVALID_OPCODE,
	NO_OP,
	HALT,
	SET_ADDRESSING_MODE,
	SET_ALU_OPERATION,
	LOAD_OPERAND_1_FROM_ACCUMULATOR,
	INCREMENT_PROGRAM_COUNTER,
	LOAD_IMMEDIATE_OPERAND,
	DIRECT_OPERAND_TO_ADDRESS_BUS,
	SIGNAL_MEMORY_FETCH,
	SIGNAL_MEMORY_READ,
	SIGNAL_MEMORY_WRITE,
	LOAD_OPERAND_2_FROM_MEMORY,
	SET_PROGRAM_COUNTER_TO_DIRECT_OPERAND,
	EXECUTE_OPERATION,
	UPDATE_STATUS_WORD,
	ACCUMULATOR_TO_DATA_BUS,
	ACCUMULATOR_STORED_TO_MEMORY,
}

/** The stage of the {@link Execution} */
export enum ExecutionStage {
	FETCH,
	DECODE,
	EXECUTE,
	INCREMENT_PROGRAM_COUNTER,
}

/** Stepping mode for the {@link Execution} */
export enum ExecutionSteppingMode {
	/** Keep executing until the end of the program is reached */
	PROGRAM,
	/** Keep executing until the end of the instruction is reached */
	INSTRUCTION,
	/** Keep executing until the end of the step is reached */
	STEP,
}
