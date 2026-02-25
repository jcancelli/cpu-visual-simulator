import { BusID } from "$lib/types/bus"
import { CPUVSError } from "./cpuvs"

/** Base class for errors regarding a {@link Bus} */
export abstract class BusError extends CPUVSError {}

/** Error regarding a send signal operation on a {@link Bus} that is already carrying a signal */
export class SignalConflictError extends BusError {
	/** The bus regarding the conflict of signals */
	public readonly busID?: BusID

	constructor(busID?: BusID) {
		if (busID !== undefined) {
			super(`Multiple signals are being sent on bus "${BusID[busID]}"`)
		} else {
			super("Multiple signals are being sent on the same bus")
		}
		this.busID = busID
	}
}

/** Error regarding a read signal operation on a {@link Bus} that is not carrying a signal */
export class NoSignalError extends BusError {
	/** The bus with no signal */
	public readonly busID?: BusID

	constructor(busID?: BusID) {
		if (busID !== undefined) {
			super(`Tring to read a signal from bus "${BusID[busID]}", but no signal was found`)
		} else {
			super("Tring to read a signal from a bus, but no signal was found")
		}
		this.busID = busID
	}
}

/** Error regarding an end signal operation on a {@link Bus} that is already not carrying a signal */
export class AlreadyNoSignalError extends BusError {
	/** The bus with no signal */
	public readonly busID?: BusID

	constructor(busID?: BusID) {
		if (busID !== undefined) {
			super(`Tring to end the signal on bus "${BusID[busID]}" that already has no signal`)
		} else {
			super("Tring to end the signal on a bus that already has no signal")
		}
		this.busID = busID
	}
}
