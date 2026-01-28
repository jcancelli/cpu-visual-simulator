export interface StateMachine {
	/** Implementation of the step for this state machine
	 * @returns true if it should keep executing */
	step(): Promise<boolean>
}

/** Wrapper for a {@link StateMachine} instance.
 * Allows the state machine to be executed without blocking the UI.
 * Allows also to pause/resume the execution of the state machine */
export default class NonBlockingStateMachine {
	/** Private variable holding the state of the statemachine execution.
	 * Initialized using the $state rune */
	private _isRunning: boolean
	/** Public readonly constant that mirrors {@link NonBlockingStateMachine._isRunning}.
	 * Initialized using the $derived rune*/
	public readonly isRunning: boolean
	/** The state machine that is being executed */
	private readonly stateMachine: StateMachine
	/** Function that wraps the state machine logic with {@link NonBlockingStateMachine} logic.
	 * Declared as a readonly member arrow function so that it can hold a reference to `this`*/
	private readonly stepFunction: () => void
	/** Promise that is resolved when the execution of the lastly executed step is done */
	private stepPromise: Promise<void> | null

	constructor(stateMachine: StateMachine) {
		this._isRunning = $state(false)
		this.isRunning = $derived(this._isRunning)
		this.stateMachine = stateMachine
		this.stepFunction = async () => {
			if (!this._isRunning) {
				return
			}
			this.stepPromise = this.stateMachine.step().then(shouldKeepGoing => {
				// NOTE: Need to && with _isRunning because the user might have tried to stop execution
				this._isRunning = this._isRunning && shouldKeepGoing
				if (this._isRunning) {
					setTimeout(this.stepFunction)
				}
			})
		}
		this.stepPromise = null
	}

	/** Start the execution */
	start(): void {
		if (this._isRunning) {
			return
		}
		this._isRunning = true
		setTimeout(this.stepFunction)
	}

	/** Stop the execution */
	stop(): void {
		if (!this._isRunning) {
			return
		}
		this._isRunning = false
	}

	/** Toggle the execution on/off */
	toggle(): void {
		if (this._isRunning) {
			this.stop()
		} else {
			this.start()
		}
	}

	/** Await for the step that was lastly executed to finish */
	async awaitStepDone(): Promise<void> {
		await this.stepPromise
	}
}
