/** Represents an object that can be executed by a {@link NonBlockingLoop} instance */
export interface Cyclable {
	/** Method called by the {@link NonBlockingLoop} that is executing this object. Implements the body of the NonBlockingLoop */
	cycle(): void | Promise<void>
}

/** Represents an infinite loop that doesn't block the execution of the main program */
export default class NonBlockingLoop {
	/** The default amount of milliseconds between two iterations of the loop */
	public static readonly DEFAULT_INTERVAL_MS = 200
	/** The ID of the interval that is executing the loop */
	protected intervalId: NodeJS.Timer
	/** The amount of milliseconds between two iterations of the loop */
	protected intervalMs: number
	/** The object that implements the loop execution */
	protected cyclable: Cyclable
	/** Prevents concurrency. */
	protected isLocked: boolean

	/**
	 * @param {Cyclable} cyclable - The object that implements the loop execution
	 * @param {number} intervalMs - The amount of milliseconds between two iterations of the loop
	 */
	constructor(cyclable: Cyclable, intervalMs: number = NonBlockingLoop.DEFAULT_INTERVAL_MS) {
		if (!cyclable) {
			throw new Error("Null or undefined cyclable")
		} else if (intervalMs < 1) {
			throw new Error("intervalMs must be greater than 0")
		}
		this.intervalId = null
		this.cyclable = cyclable
		this.intervalMs = intervalMs
		this.isLocked = false
	}

	/** Starts the execution of the loop */
	start(): void {
		if (this.intervalId !== null) {
			return
		}
		this.intervalId = setInterval(async () => {
			if (this.isLocked) {
				return
			}
			this.isLocked = true
			await this.cyclable.cycle()
			this.isLocked = false
		}, this.intervalMs)
	}

	/** Stops the execution of the loop */
	stop(): void {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
	}
}
