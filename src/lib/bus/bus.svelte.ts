import { NoSignalError, SignalConflictError } from "$lib/errors/bus"
import type { BusID } from "$lib/types/bus"
import {
	assertI16,
	assertI8,
	assertU16,
	assertU8,
	i16,
	i8,
	u16,
	u8,
	type Int,
	type UInt,
} from "$lib/types/integer"

/** Value representing the absence of a signal on a bus */
export const NO_SIGNAL = Symbol("NO_SIGNAL")

/** The absence of a signal */
export type NoSignal = typeof NO_SIGNAL

/** Signal carried by a bus */
export type Signal<T> = NoSignal | T

/** Size of a bus signal in bits */
export type BusSizeBits = 8 | 16

/** Assert that the provided signal carries a value.
 * @throws {NoSignalError}*/
export function assertSignal<T>(signal: Signal<T>, busID?: BusID): asserts signal is T {
	if (signal === NO_SIGNAL) {
		throw new NoSignalError(busID)
	}
}

/** A bus that transmits a signal of fixed size */
export interface Bus<Bits extends BusSizeBits> {
	/** The size in bits of this bus */
	get sizeBits(): Bits
	/** Wether this bus is carrying a signal or not */
	get hasSignal(): boolean
	/** The signal currently carried by this bus as a signed integer or no signal */
	get signed(): Signal<Int<Bits>>
	/** The signal currently carried by this bus as an unsigned integer or no signal */
	get unsigned(): Signal<UInt<Bits>>
	/** Send the provided signed integer as a signal on this bus.
	 * @throws {SignalConflictError}
	 * @throws {IntegerOutOfRangeError} */
	sendSignalSigned(signed: Int<Bits>): void
	/** Send the provided unsigned integer as a signal on this bus.
	 * @throws {SignalConflictError}
	 * @throws {IntegerOutOfRangeError} */
	sendSignalUnsigned(unsigned: UInt<Bits>): void
	/** End the signal currently transmitted on this bus.
	 * @throws {AlreadyNoSignalError} */
	endSignal(): void
}

/** A bus that carries an 8-bit signal */
export type ByteBus = Bus<8>

/** A bus that carries a 16-bit signal */
export type WordBus = Bus<16>

/** Base class for {@link Bus} implementations */
export abstract class BusImpl<Bits extends BusSizeBits> implements Bus<Bits> {
	/** The signal carried by this bus as an unsigned value */
	private signal: Signal<UInt<Bits>>

	constructor() {
		this.signal = $state(NO_SIGNAL)
	}

	abstract get sizeBits(): Bits

	/** Wether or not this bus carries a signal */
	get hasSignal(): boolean {
		return this.signal !== NO_SIGNAL
	}

	/** The signal carried by this bus as a signed integer */
	get signed(): Signal<Int<Bits>> {
		if (this.signal === NO_SIGNAL) {
			return NO_SIGNAL
		}
		return this.unsignedToSigned(this.signal)
	}

	/** The signal carried by this bus as an unsigned integer */
	get unsigned(): Signal<UInt<Bits>> {
		return this.signal
	}

	/** Send a signed integer as a signal on this bus.
	 * @throws {IntegerOutOfRangeError}
	 * @throws {SignalConflictError}
	 * @throws If the provided value fails validation. The actual type of the error depends on the subclass */
	sendSignalSigned(signal: Int<Bits>): void {
		if (this.signal !== NO_SIGNAL) {
			throw new SignalConflictError()
		}
		this.assertSigned(signal)
		const unsigned = this.signedToUnsigned(signal)
		this.assertValid(unsigned)
		this.signal = unsigned
	}

	/** Send an unsigned integer as a signal on this bus.
	 * @throws {IntegerOutOfRangeError}
	 * @throws {SignalConflictError}
	 * @throws If the provided value fails validation. The actual type of the error depends on the subclass */
	sendSignalUnsigned(signal: UInt<Bits>): void {
		if (this.signal !== NO_SIGNAL) {
			throw new SignalConflictError()
		}
		this.assertUnsigned(signal)
		this.assertValid(signal)
		this.signal = signal
	}

	/** End the signal that is being transmitted on this bus.
	 * @throws {AlreadyNoSignalError} */
	endSignal(): void {
		if (this.signal === NO_SIGNAL) {
			throw new NoSignalError()
		}
		this.signal = NO_SIGNAL
	}

	/** Assert that the provided value is a valid signed integer of {@link Bits} bits */
	protected abstract assertSigned(signed: number): asserts signed is Int<Bits>
	/** Assert that the provided value is a valid unsigned integer of {@link Bits} bits */
	protected abstract assertUnsigned(unsigned: number): asserts unsigned is UInt<Bits>
	/** Cast the provided signed integer of size {@link Bits} to an unsigned integer of the same size */
	protected abstract signedToUnsigned(signed: Int<Bits>): UInt<Bits>
	/** Cast the provided unsigned integer of size {@link Bits} to a signed integer of the same size */
	protected abstract unsignedToSigned(unsigned: UInt<Bits>): Int<Bits>
	/** Assert with subclass specific validation */
	protected abstract assertValid(unsigned: UInt<Bits>): void
}

/** Implementation of {@link ByteBus} */
export class ByteBusImpl extends BusImpl<8> implements ByteBus {
	override get sizeBits(): 8 {
		return 8
	}

	protected override assertSigned(signed: Int<8>): asserts signed is Int<8> {
		assertI8(signed)
	}

	protected override assertUnsigned(unsigned: UInt<8>): asserts unsigned is UInt<8> {
		assertU8(unsigned)
	}

	protected override signedToUnsigned(signed: Int<8>): UInt<8> {
		return u8(signed)
	}

	protected override unsignedToSigned(unsigned: UInt<8>): Int<8> {
		return i8(unsigned)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- When a subclass overrides this, it will need a parameter. If i remove the parameter, typescript will complain that the overriding function parameters do not match the parameters of this function
	protected override assertValid(_: UInt<8>): void {}
}

/** Implementation of {@link WordBus} */
export class WordBusImpl extends BusImpl<16> implements WordBus {
	override get sizeBits(): 16 {
		return 16
	}

	protected override assertSigned(signal: Int<16>): asserts signal is Int<16> {
		assertI16(signal)
	}

	protected override assertUnsigned(signal: UInt<16>): asserts signal is UInt<16> {
		assertU16(signal)
	}

	protected override signedToUnsigned(signal: Int<16>): UInt<16> {
		return u16(signal)
	}

	protected override unsignedToSigned(signal: UInt<16>): Int<16> {
		return i16(signal)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- When a subclass overrides this, it will need a parameter. If i remove the parameter, typescript will complain that the overriding function parameters do not match the parameters of this function
	protected override assertValid(_: UInt<16>): void {}
}
