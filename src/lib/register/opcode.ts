import type { U8 } from "$lib/types/integer"
import {
	assertOpcodeAllowsImmediateOperand,
	encodeOpcode,
	getImmediateFlag,
	getOpcodeByNumeric,
	getOpcodeByNumericOrThrow,
	OPCODE_NOP,
	setImmediateFlag,
	type Opcode,
} from "$lib/types/opcode"
import { ByteRegisterImpl, type ByteRegister } from "./register.svelte"

/** Register that can store a valid opcode */
export interface OpcodeRegister extends ByteRegister {
	/** The opcode stored in this register */
	get opcode(): Opcode
	/** The opcode stored in this register */
	set opcode(opcode: Opcode)
	/** The value of the immediate flag stored in this register */
	get immediateFlag(): boolean
	/** The value of the immediate flag stored in this register.
	 * @throws {ImmediateFlagNotAllowedError} */
	set immediateFlag(flag: boolean)
}

/** Implementation of {@link OpcodeRegister} */
export class OpcodeRegisterImpl extends ByteRegisterImpl implements OpcodeRegister {
	constructor(opcode: Opcode = OPCODE_NOP, immediateFlag: boolean = false) {
		super(encodeOpcode(opcode, immediateFlag))
	}

	get opcode(): Opcode {
		return getOpcodeByNumeric(this.unsigned)!
	}

	set opcode(opcode: Opcode) {
		this.unsigned = opcode.numeric
	}

	get immediateFlag(): boolean {
		return getImmediateFlag(this.unsigned)
	}

	set immediateFlag(flag: boolean) {
		if (flag) {
			assertOpcodeAllowsImmediateOperand(this.opcode)
		}
		this.unsigned = setImmediateFlag(this.unsigned, flag)
	}

	protected override assertValid(value: U8): void {
		getOpcodeByNumericOrThrow(value)
	}
}
