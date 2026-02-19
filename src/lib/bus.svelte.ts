import { assertAddressingMode, InvalidAddressingModeError, type AddressingMode } from "./cpu.svelte"
import {
	assertU16,
	assertU8,
	i16,
	i8,
	InvalidU16Error,
	InvalidU8Error,
	type U16,
	type U8,
} from "./integer"
import {
	assertMemoryOperation,
	InvalidMemoryOperationError,
	type MemoryOperation,
} from "./memory.svelte"
import { type Opcode } from "./opcode"

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

/** Represents a bus transporting data that can be interpreted as a signed or unsigned integer */
export abstract class Bus<T, SignalValidationError extends Error = never> {
	/** The value of the signal */
	private _signal: BusSignal<T>

	constructor() {
		this._signal = $state(NO_SIGNAL)
	}

	/** Put a signal on the bus.
	 * @throws {InvalidBusSignalError<SignalValidationError>} */
	putSignal(signal: T): void {
		try {
			this.assertValidSignal(signal)
			this._signal = signal
		} catch (error: unknown) {
			throw new InvalidBusSignalError(error as SignalValidationError)
		}
	}

	/** End the signal that was put on the bus (sets the signal to {@link NO_SIGNAL}) */
	endSignal(): void {
		this._signal = NO_SIGNAL
	}

	/** Wether a signal is being transmitted or not */
	hasSignal(): boolean {
		return this._signal !== NO_SIGNAL
	}

	/** The value of the signal */
	get signal(): BusSignal<T> {
		return this._signal
	}

	/** The value of the signal as a signed integer. 0 if there is no signal */
	get signedSignal(): number {
		return this._signal === NO_SIGNAL ? 0 : this.signalToSigned(this._signal)
	}

	/** The value of the signal as an unsigned integer. 0 if there is no signal */
	get unsignedSignal(): number {
		return this._signal === NO_SIGNAL ? 0 : this.signalToUnsigned(this._signal)
	}

	/** Asserts that a value is a valid signal.
	 * @throws {SignalValidationError} */
	protected abstract assertValidSignal(signal: T): asserts signal is T
	/** Cast a signal value to a signed integer */
	protected abstract signalToSigned(signal: T): number
	/** Cast a signal value to an unsigned integer */
	protected abstract signalToUnsigned(signal: T): number
}

/** A bus that transports an 8-bit integer */
export class ByteBus extends Bus<U8, InvalidU8Error> {
	protected override assertValidSignal(signal: U8): asserts signal is U8 {
		assertU8(signal)
	}

	protected override signalToSigned(signal: U8): number {
		return i8(signal)
	}

	protected override signalToUnsigned(signal: U8): number {
		return signal
	}
}

/** A bus that transports a 16-bit integer */
export class WordBus extends Bus<U16, InvalidU16Error> {
	protected override assertValidSignal(signal: U16): asserts signal is U16 {
		assertU16(signal)
	}

	protected override signalToSigned(signal: U16): number {
		return i16(signal)
	}

	protected override signalToUnsigned(signal: U16): number {
		return signal
	}
}

/** A bus that transports a {@link MemoryOperation} */
export class MemoryOperationBus extends Bus<MemoryOperation, InvalidMemoryOperationError> {
	protected override assertValidSignal(
		signal: MemoryOperation,
	): asserts signal is MemoryOperation {
		assertMemoryOperation(signal)
	}

	protected override signalToSigned(signal: MemoryOperation): number {
		return i8(signal)
	}

	protected override signalToUnsigned(signal: MemoryOperation): number {
		return signal
	}
}

/** A bus that transports an {@link AddressingMode} */
export class AddressingModeBus extends Bus<AddressingMode, InvalidAddressingModeError> {
	protected override assertValidSignal(signal: AddressingMode): asserts signal is AddressingMode {
		assertAddressingMode(signal)
	}

	protected override signalToSigned(signal: AddressingMode): number {
		return i8(signal)
	}

	protected override signalToUnsigned(signal: AddressingMode): number {
		return signal
	}
}

/** A bus that transports an {@link Opcode} */
export class OpcodeBus extends Bus<Opcode> {
	protected assertValidSignal(signal: Opcode): asserts signal is Opcode {}

	protected signalToSigned(signal: Opcode): number {
		return i8(signal.numeric)
	}

	protected signalToUnsigned(signal: Opcode): number {
		return signal.numeric
	}
}

/** Base class for errors regarding a bus */
export abstract class BusError extends Error {}

/** Error thrown when a value was expected to be found on a {@link Bus}, but {@link NO_SIGNAL} was found */
export class NoSignalError extends BusError {}

/** An error regarding an invalid value being put on a bus */
export class InvalidBusSignalError<T extends Error> extends BusError {
	/** The error thrown during signal validation */
	public readonly validationError: T

	constructor(validationError: T) {
		super(validationError.message)
		this.validationError = validationError
	}
}
