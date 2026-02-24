import { CPUVSError } from "./cpuvs"

/** Base class for errors regarding a {@link Bus} */
export abstract class BusError extends CPUVSError {}

/** Error regarding a read signal operation on a {@link Bus} that is not carrying a signal */
export class NoSignalError extends BusError {
	constructor() {
		super("Trying to read from a bus with no signal")
	}
}
