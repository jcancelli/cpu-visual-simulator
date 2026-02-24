import {
	type OpcodeWithOperand,
	type OpcodeWithoutImmediate,
	type OpcodeWithoutOperand,
} from "$lib/types/opcode"

/** Base class for errors regarding {@link Opcode} */
export abstract class OpcodeError extends Error {}

/** Error regarding a number that does not match any valid {@link OpcodeNumeric} */
export class InvalidNumericOpcodeError extends OpcodeError {
	/** The value that caused the error */
	public readonly invalidValue: number

	constructor(invalidValue: number) {
		super(`"${invalidValue}" is not a valid numeric opcode value`)
		this.invalidValue = invalidValue
	}
}

/** Error regarding a string that does not match any valid {@link OpcodeSymbolic} */
export class InvalidSymbolicOpcodeError extends OpcodeError {
	/** The value that caused the error */
	public readonly invalidValue: string

	constructor(invalidValue: string) {
		super(`"${invalidValue}" is not a valid opcode`)
		this.invalidValue = invalidValue
	}
}

/** Error regarding an opcode that does not take operands but an operand was found */
export class OperandNotAllowedError extends OpcodeError {
	/** The opcode that caused the error */
	public readonly opcode: OpcodeWithoutOperand

	constructor(opcode: OpcodeWithoutOperand) {
		super(`Opcode ${opcode.symbolic} does not take an operand`)
		this.opcode = opcode
	}
}

/** Error regarding an opcode that needs an operand but no operand was found */
export class OperandRequiredError extends OpcodeError {
	/** The opcode that caused the error */
	public readonly opcode: OpcodeWithOperand

	constructor(opcode: OpcodeWithOperand) {
		super(`Opcode ${opcode.symbolic} requires an operand`)
		this.opcode = opcode
	}
}

/** Error regarding an opcode that does not allow immediate operands but an immediate flag was found */
export class ImmediateFlagNotAllowedError extends OpcodeError {
	/** The opcode that caused the error */
	public readonly opcode: OpcodeWithoutImmediate

	constructor(opcode: OpcodeWithoutImmediate) {
		super(`Opcode ${opcode.symbolic} does not allow immediate operands`)
		this.opcode = opcode
	}
}
