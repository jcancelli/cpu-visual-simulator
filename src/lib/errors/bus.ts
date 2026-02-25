import { BusID } from "$lib/types/bus"
import { CPUVSError } from "./cpuvs"

/** Base class for errors regarding a {@link Bus} */
export abstract class BusError extends CPUVSError {}

/** Error regarding a send signal operation on a {@link Bus} that is already carrying a signal */
export class SignalConflictError extends BusError {
	/** The bus regarding the conflict of signals */
	public readonly busID: BusID

	constructor(busID: BusID) {
		super(`Multiple signals being sent on bus "${BusID[busID]}"`)
		this.busID = busID
	}
}

/** Error regarding a read/end signal operation on a {@link Bus} that is not carrying a signal */
export class NoSignalError extends BusError {
	/** The bus with no signal */
	public readonly busID: BusID

	constructor(busID: BusID) {
		super(`Tring to end/read signal from bus "${BusID[busID]}" that has no signal`)
		this.busID = busID
	}
}
