import type AsyncLoop from "./async_loop"

/** Queue a macro task for execution on the stack */
const queueTask = setTimeout

/** Allows to execute/pause/resume a loop without hogging the execution stack. */
export default class AsyncLoopExecutor {
	private loop: AsyncLoop
	private _isRunning: boolean

	constructor(loop: AsyncLoop) {
		if (!loop) {
			throw new Error(`null or undefined loop`)
		}
		this.loop = loop
		this._isRunning = false
	}

	/** Start loop execution */
	start() {
		if (this._isRunning) {
			return
		}
		this._isRunning = true
		queueTask(this.cycle.bind(this))
	}

	/** Pause/stops loop execution */
	stop() {
		this._isRunning = false
	}

	/** Wether the loop is currently running or not */
	isRunning(): boolean {
		return this._isRunning
	}

	/** Execute one cycle of the loop */
	private async cycle(): Promise<void> {
		if (!this._isRunning) {
			return
		}

		const keepRunning = await this.loop.cycle()

		if (this._isRunning && keepRunning) {
			queueTask(this.cycle.bind(this))
		} else {
			this._isRunning = false
		}
	}
}
