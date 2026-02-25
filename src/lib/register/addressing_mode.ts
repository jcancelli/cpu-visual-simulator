import { Addressing, assertAddressing } from "$lib/types/cpu"
import type { U8 } from "$lib/types/integer"
import { ByteRegisterImpl, type ByteRegister } from "./register.svelte"

/** Register that can store a valid memory operation value */
export interface AddressingModeRegister extends ByteRegister {
	/** The value of the addressing mode stored in this register */
	get value(): Addressing
	/** The value of the addressing mode stored in this register.
	 * @throws {InvalidAddressingModeError} */
	set value(value: Addressing)
}

/** Implementation of {@link AddressingModeRegisterImpl} */
export class AddressingModeRegisterImpl extends ByteRegisterImpl implements AddressingModeRegister {
	constructor(initialValue: Addressing = Addressing.IMMEDIATE) {
		super(initialValue as U8)
	}

	get value(): Addressing {
		return this.unsigned as Addressing
	}

	set value(value: Addressing) {
		this.unsigned = value
	}

	protected override assertValid(value: U8): void {
		assertAddressing(value)
	}
}
