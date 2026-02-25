import type { U8 } from "$lib/types/integer"
import {
	assertStatusWord,
	encodeStatusWord,
	getNegativeFlag,
	getZeroFlag,
	setNegativeFlag,
	setZeroFlag,
	type StatusWord,
} from "$lib/types/status_word"
import { ByteRegisterImpl, type ByteRegister } from "./register.svelte"

/** Register that can store a valid status word */
export interface StatusWordRegister extends ByteRegister {
	/** The value of the status word */
	get value(): StatusWord
	/** The value of the status word.
	 * @throws {InvalidStatusWordError} */
	set value(value: StatusWord)
	/** State of the zero flag stored in this register */
	get zeroFlag(): boolean
	/** State of the zero flag stored in this register */
	set zeroFlag(flag: boolean)
	/** State of the negative flag stored in this register */
	get negativeFlag(): boolean
	/** State of the negative flag stored in this register */
	set negativeFlag(flag: boolean)
}

/** Implementation of {@link StatusWordRegister} */
export class StatusWordRegisterImpl extends ByteRegisterImpl implements StatusWordRegister {
	constructor(zeroFlag: boolean = true, negativeFlag: boolean = false) {
		super(encodeStatusWord(zeroFlag, negativeFlag))
	}

	get value(): StatusWord {
		return this.unsigned as StatusWord
	}

	set value(value: StatusWord) {
		this.unsigned = value
	}

	get zeroFlag(): boolean {
		return getZeroFlag(this.value)
	}

	set zeroFlag(flag: boolean) {
		this.value = setZeroFlag(this.value, flag)
	}

	get negativeFlag(): boolean {
		return getNegativeFlag(this.value)
	}

	set negativeFlag(flag: boolean) {
		this.value = setNegativeFlag(this.value, flag)
	}

	protected override assertValid(value: U8): void {
		assertStatusWord(value)
	}
}
