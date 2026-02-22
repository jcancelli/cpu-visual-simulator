import type { ByteBus } from "./bus.svelte"
import { CPUError } from "./cpu.svelte"
import { i8, type I8, type U8 } from "./integer"

/** The bit of the status word zero flag */
export const ZERO_FLAG_BIT = 1 << 7
/** All the bits of the status word except the zero flag set to 1 */
export const ZERO_FLAG_MASK = ~ZERO_FLAG_BIT >>> 0
/** The bit of the status word negative flag */
export const NEGATIVE_FLAG_BIT = 1 << 6
/** All the bits of the status word except the negative flag set to 1 */
export const NEGATIVE_FLAG_MASK = ~NEGATIVE_FLAG_BIT >>> 0
/** All the bits of the status word set to 0 except the ones used for flags */
export const ALL_FLAGS = ZERO_FLAG_BIT | NEGATIVE_FLAG_BIT

/** Check if the provided value is a valid status word value */
export function isValidStatusWord(value: number): boolean {
	return (value & ALL_FLAGS) === value
}

/** Asserts that the provided value is a valid status word value.
 * @throws {InvalidStatusWordError} */
export function assertValidStatusWord(value: number): void {
	if (!isValidStatusWord(value)) {
		throw new InvalidStatusWordError(value)
	}
}

/** State of the status word */
export class StatusWord {
	private _unsigned: U8
	/** The value connecting the status word to the ALU */
	private aluBus: ByteBus

	constructor(aluBus: ByteBus) {
		this._unsigned = $state(0 as U8)
		this.aluBus = aluBus
	}

	get zeroFlag(): boolean {
		return (this._unsigned & ZERO_FLAG_BIT) !== 0
	}

	set zeroFlag(flag: boolean) {
		if (flag) {
			;(this._unsigned as number) |= ZERO_FLAG_BIT
		} else {
			;(this._unsigned as number) &= ZERO_FLAG_MASK
		}
	}

	get negativeFlag(): boolean {
		return (this._unsigned & NEGATIVE_FLAG_BIT) !== 0
	}

	set negativeFlag(flag: boolean) {
		if (flag) {
			;(this._unsigned as number) |= NEGATIVE_FLAG_BIT
		} else {
			;(this._unsigned as number) &= NEGATIVE_FLAG_MASK
		}
	}

	get unsigned(): U8 {
		return this._unsigned as U8
	}

	get signed(): I8 {
		return i8(this._unsigned)
	}

	/** Set the value of the status word to the value found on the bus connecting it to the ALU.
	 * @throws {NoSignalError}
	 * @throws {InvalidStatusWordError} */
	readAluSignal(): void {
		const signal = this.aluBus.readSignalOrThrow()
		assertValidStatusWord(signal)
		this._unsigned = signal
	}

	/** Send the value of the status word on the bus connecting it to the ALU */
	sendAluSignal(): void {
		this.aluBus.sendSignal(this._unsigned)
	}
}

/** Error regarding an invalid status word value */
export class InvalidStatusWordError extends CPUError {
	/** The invalid value */
	public readonly value: number

	constructor(value: number) {
		super(`Invalid status word value: ${value.toString(2).padStart(8, "0")}`)
		this.value = value
	}
}
