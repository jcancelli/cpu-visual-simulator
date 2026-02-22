import { unreachable } from "$lib/util/development"
import {
	ACTION_HANDLED,
	ActionHandlerMap,
	type ActionConsumer,
	type ActionHandlerResult,
} from "./action_performer"
import type { StateMachine } from "./non_blocking_state_machine.svelte"
import { ActionType } from "./task"
import type { TaskSystem } from "./task_system"

/** The state of the {@link ExecutionStateMachine} */
export enum State {
	READY,
	SUBMITTING,
	EXECUTING,
	HALTING,
}

/** When execution should be halted */
export enum StepMode {
	/** Execution is halted only when the program ends */
	PROGRAM,
	/** Execution is halted only when an instruction ends */
	INSTRUCTION,
	/** Execution is halted only when a step or instruction ends */
	STEP,
}

/** {@link ActionType} handled by {@link ExecutionStateMachine} */
export type ExecutionHandledActionTypes =
	| ActionType.HALT_EXECUTION
	| ActionType.END_INSTRUCTION
	| ActionType.END_STEP

/** Implements the flow of execution of the simulator */
export default class ExecutionStateMachine
	implements StateMachine, ActionConsumer<ExecutionHandledActionTypes>
{
	/** The task system used to schedule and execute the tasks that implement the execution of the simulator */
	private taskSystem: TaskSystem
	/** The current state of this state machine */
	private _state: State
	/** The current stepping mode of execution */
	private _stepMode: StepMode
	/** Wether this state machine is in the process of halting or not */
	private _isHalting: boolean

	public readonly actionHandlers: ActionHandlerMap<ExecutionHandledActionTypes>

	constructor(taskSystem: TaskSystem) {
		this.taskSystem = taskSystem
		this._state = $state(State.READY)
		this._stepMode = $state(StepMode.PROGRAM)
		this._isHalting = $state(false)
		this.actionHandlers = new ActionHandlerMap({
			[ActionType.HALT_EXECUTION]: this.handleHaltExecutionAction.bind(this),
			[ActionType.END_INSTRUCTION]: this.handleEndInstructionAction.bind(this),
			[ActionType.END_STEP]: this.handleEndStepAction.bind(this),
		})
	}

	/** The current state of this state machine */
	get state(): State {
		return this._state
	}

	/** The current stepping mode of execution */
	get stepMode(): StepMode {
		return this._stepMode
	}

	/** The current stepping mode of execution */
	set stepMode(mode: StepMode) {
		this._stepMode = mode
	}

	/** Wether this state machine is in the process of halting or not */
	get isHalting(): boolean {
		return this._isHalting
	}

	async step(): Promise<boolean> {
		switch (this._state) {
			case State.READY:
				this._state = State.SUBMITTING
				return true

			case State.SUBMITTING:
				this.taskSystem.submitTasksAfter(/* TODO: pass the fetch, decode and execute actions preset*/)
				this._state = State.EXECUTING
				return true

			case State.EXECUTING:
				await this.taskSystem.executeNextTask()
				if (this.taskSystem.isDone()) {
					this._state = this._isHalting ? State.HALTING : State.READY
				}
				return true

			case State.HALTING:
				this._isHalting = false
				this._state = State.READY
				return false

			default:
				unreachable()
		}
	}

	/** {@link ActionHandler} for {@link HaltExecutionAction} */
	private async handleHaltExecutionAction(): Promise<ActionHandlerResult> {
		this._isHalting = true
		return ACTION_HANDLED
	}

	/** {@link ActionHandler} for {@link EndInstructionAction} */
	private async handleEndInstructionAction(): Promise<ActionHandlerResult> {
		if (this._stepMode === StepMode.INSTRUCTION || this._stepMode === StepMode.STEP) {
			this._isHalting = true
		}
		return ACTION_HANDLED
	}

	/** {@link ActionHandler} for {@link EndStepAction} */
	private async handleEndStepAction(): Promise<ActionHandlerResult> {
		if (this._stepMode === StepMode.STEP) {
			this._isHalting = true
		}
		return ACTION_HANDLED
	}
}
