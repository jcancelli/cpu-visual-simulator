/** Named breakpoints of the execution. These steps have a textual description displayed in the step description
 * box UI element and a text to speech sentence associated to them.
 * If the {@link Execution} {@link ExecutionSteppingMode|stepping mode} is set to {@link ExecutionSteppingMode.STEP}, every time the end
 * of the step is signaled the execution is paused */
export enum ExecutionStep {
	/** The program counter is sent to the memory through the control bus */
	PROGRAM_COUNTER_TO_MEMORY,
	/** The value stored at the selected address is sent from memory to the instruction register through the data bus */
	MEMORY_TO_INSTRUCTION_REGISTER,
	/** The opcode stored in the instruction register is decoded by the decoder */
	DECODE_OPCODE,
	/** The value sent by the instruction register to the decoder was an invalid opcode */
	INVALID_OPCODE,
	/** NOP instruction is "executed" */
	NO_OP,
	/** Execution halted because of an HLT instruction */
	HALT,
	/** The decoded opcode is sent from the decoder to the ALU through the ALU control bus */
	SET_ALU_OPERATION,
	/** The addressing mode selected by the control unit is sent to the multiplexer through the MUX control bus */
	SET_ADDRESSING_MODE,
	/** A division by zero was performed. Execution is halted. */
	DIVISION_BY_ZERO,
	/** The program counter is incremented */
	INCREMENT_PROGRAM_COUNTER,
	/** Execution is halted after the instruction at the last address was executed */
	LAST_ADDRESS_REACHED,
	/** The content of the accumulator is loaded as the first operand of the ALU through the data bus */
	LOAD_OPERAND_1_FROM_ACCUMULATOR,
	/** The second operand of the ALU is loaded from the immediate operand stored in the instruction register */
	LOAD_OPERAND_2_FROM_INSTRUCTION_REGISTER,
	/** The second operand of the ALU is loaded from memory through the data bus */
	LOAD_OPERAND_2_FROM_MEMORY,
	/** The address stored as operand in the instruction register is loaded into the program counter through the address bus */
	OPERAND_TO_PROGRAM_COUNTER,
	/** The condition of the conditional jump is checked */
	CHECK_STATUS_WORD_FLAG,
	/** A memory fetch operation is signaled to the memory through the memory control bus */
	SIGNAL_MEMORY_FETCH,
	/** A memory read operation is signaled to the memory through the memory control bus */
	SIGNAL_MEMORY_READ,
	/** A memory write operation is signaled to the memory through the memory control bus */
	SIGNAL_MEMORY_WRITE,
	/** The ALU perform its operation */
	EXECUTE_ALU_OPERATION,
	/** The value of the status word is updated */
	UPDATE_STATUS_WORD,
	/** The value of the accumulator is sent on the data bus and stored into memory */
	ACCUMULATOR_STORED_TO_MEMORY,
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
