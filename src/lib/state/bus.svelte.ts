import {
	assertI16,
	assertI8,
	assertU16,
	assertU8,
	i16,
	i8,
	u16,
	u8,
	type I16,
	type I8,
	type Int,
	type U16,
	type U8,
	type UInt,
} from "$lib/integer"

/** Value representing no signal on a bus */
export const NO_SIGNAL = Symbol("NO_SIGNAL")

/** Either a value or {@link NO_SIGNAL} */
export type BusSignal<T> = typeof NO_SIGNAL | T

/** Asserts that the signal carries a value.
 * @throws {NoSignalError}*/
export function assertSignal<T>(signal: BusSignal<T>): asserts signal is T {
	if (signal === NO_SIGNAL) {
		throw new NoSignalError()
	}
}

/** Readonly version of a {@link Bus} */
export type ReadonlyBus<Bits extends number> = Omit<
	Bus<Bits>,
	"sendSignalSigned" | "sendSignalUnsigned" | "endSignal"
>

/** Base class for the state of a bus that carries a {@link Bits} sized signal */
export abstract class Bus<Bits extends number> {
	/** The signal carried by this bus as an unsigned value */
	private signal: BusSignal<UInt<Bits>>

	constructor() {
		this.signal = $state(NO_SIGNAL)
	}

	/** The signal carried by this bus as a signed integer */
	get signalSigned(): BusSignal<Int<Bits>> {
		if (this.signal === NO_SIGNAL) {
			return NO_SIGNAL
		}
		return this.unsignedToSigned(this.signal)
	}

	/** The signal carried by this bus as an unsigned integer */
	get signalUnsigned(): BusSignal<UInt<Bits>> {
		return this.signal
	}

	/** Send a signed integer as a signal on this bus.
	 * @throws {IntegerOutOfRangeError} */
	sendSignalSigned(signal: Int<Bits>): void {
		this.assertSigned(signal)
		this.signal = this.signedToUnsigned(signal)
	}

	/** Send an unsigned integer as a signal on this bus.
	 * @throws {IntegerOutOfRangeError} */
	sendSignalUnsigned(signal: UInt<Bits>): void {
		this.assertUnsigned(signal)
		this.signal = signal
	}

	/** Read the signal on this bus as a signed integer or throw an error if there is no signal.
	 * @throws {NoSignalError} */
	readSignalSignedOrThrow(): Int<Bits> {
		assertSignal(this.signal)
		return this.unsignedToSigned(this.signal)
	}

	/** Read the signal on this bus as an unsigned integer or throw an error if there is no signal.
	 * @throws {NoSignalError} */
	readSignalUnsignedOrThrow(): UInt<Bits> {
		assertSignal(this.signal)
		return this.signal
	}

	/** End the last signal sent on this bus */
	endSignal(): void {
		this.signal = NO_SIGNAL
	}

	/** @returns Wether or not this bus carries a signal */
	hasSignal(): boolean {
		return this.signal !== NO_SIGNAL
	}

	/** Assert that the provided value is a valid signed integer or {@link Bits} bits */
	protected abstract assertSigned(signal: Int<Bits>): asserts signal is Int<Bits>
	/** Assert that the provided value is a valid unsigned integer or {@link Bits} bits */
	protected abstract assertUnsigned(signal: UInt<Bits>): asserts signal is UInt<Bits>
	/** Cast the provided signed integer of size {@link Bits} to an unsigned integer of the same size */
	protected abstract signedToUnsigned(signal: Int<Bits>): UInt<Bits>
	/** Cast the provided unsigned integer of size {@link Bits} to a signed integer of the same size */
	protected abstract unsignedToSigned(signal: UInt<Bits>): Int<Bits>
}

/** The state of an 8-bit bus */
export class ByteBus extends Bus<8> {
	protected override assertSigned(signal: I8): asserts signal is I8 {
		assertI8(signal)
	}

	protected override assertUnsigned(signal: U8): asserts signal is U8 {
		assertU8(signal)
	}

	protected override signedToUnsigned(signal: I8): U8 {
		return u8(signal)
	}

	protected override unsignedToSigned(signal: U8): I8 {
		return i8(signal)
	}
}

/** The state of a 16-bit bus */
export class WordBus extends Bus<16> {
	protected override assertSigned(signal: I16): asserts signal is I16 {
		assertI16(signal)
	}

	protected override assertUnsigned(signal: U16): asserts signal is U16 {
		assertU16(signal)
	}

	protected override signedToUnsigned(signal: I16): U16 {
		return u16(signal)
	}

	protected override unsignedToSigned(signal: U16): I16 {
		return i16(signal)
	}
}

/** Base class for errors regarding a {@link Bus} */
export abstract class BusError extends Error {}

/** Error regarding a read signal operation on a {@link Bus} that is not carrying a signal */
export class NoSignalError extends BusError {
	constructor() {
		super(`Trying to read from a bus with no signal`)
	}
}
