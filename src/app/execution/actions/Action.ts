import logger, { LogCategory } from "../../util/logger"
import { ExecutionContext } from "../ExecutionContext"
import { Condition } from "./Conditions"
import { Wait } from "./Waits"

/** Represents an action executable by the program execution */
export default abstract class Action {
	/** A symbolic name of the action. Needed because the bundler changes the value of Action.name */
	protected _name: string
	/** True if this action is the last action of a microstep */
	protected _endsStep: boolean
	/** True if this action is the last action of an instruction */
	protected _endsInstruction: boolean
	/** A list of actions that will be executed at the same time as this action.
	 * If this action's condition evaluates to false neither this action nor its sideffects will be executed */
	protected _sideffects: Action[]
	/** A list of this action's conditions. All conditions must evaluate to true for this action to be executed */
	protected _conditions: Condition[] = []
	/** A list of Waits that will be awaited before executing this action */
	protected _waits_before: Wait[]
	/** A list of Waits that will be awaited after executing this action.
	 * This action will be considered executed only after all the waits in this list will be resolved */
	protected _waits_after: Wait[]

	constructor() {
		this._name = "Action"
		this._endsStep = false
		this._endsInstruction = false
		this._sideffects = []
		this._conditions = []
		this._waits_before = []
		this._waits_after = []
	}

	/**
	 * Adds a condition to this action execution.
	 * Before this action is executed, this (and all the eventual other) conditions are avaluated.
	 * All the conditions must return true for this action to be executed
	 * @param conditions
	 * @returns The same action this method was called on. Allows method concatenation
	 */
	condition(...conditions: Condition[]): Action {
		this._conditions.push(...conditions)
		return this
	}

	/**
	 * Marks this action as the last action of a microstep
	 * @returns The same action this method was called on. Allows method concatenation
	 */
	endstep(): Action {
		this._endsStep = true
		return this
	}

	/**
	 * Marks this action as the last action of an instruction
	 * @returns The same action this method was called on. Allows method concatenation
	 */
	endinstruction(): Action {
		this._endsInstruction = true
		return this
	}

	/**
	 * Adds sideffects to this action.
	 * A sideffect is another action that will be executed at the same time as this action.
	 * If this action's condition evaluates to false neither this action nor its sideffects will be executed
	 * @param sideffects
	 * @returns The same action this method was called on. Allows method concatenation
	 */
	sideffects(...sideffects: Action[]): Action {
		this._sideffects.push(...sideffects)
		return this
	}

	/**
	 * Add waits that will be awaited before this action execution.
	 * A wait is fundamentally a promise that can be awaited
	 * @param waits
	 * @returns The same action this method was called on. Allows method concatenation
	 */
	waitFor(...waits: Wait[]): Action {
		this._waits_before.push(...waits)
		return this
	}

	/**
	 * Add waits that will be awaited after this action execution.
	 * This action will be considered executed only after all its waits have resolved
	 * A wait is fundamentally a promise that can be awaited
	 * @param waits
	 * @returns The same action this method was called on. Allows method concatenation
	 */
	thenWaitFor(...waits: Wait[]): Action {
		this._waits_after.push(...waits)
		return this
	}

	/**
	 * Executes this action
	 * @param ctx - The object that contains all of the components needed by an action to execute (ex. cpu, ram, etc.)
	 * @returns A promise that resolves when this action has ended its execution
	 */
	async execute(ctx: ExecutionContext): Promise<any> {
		if (!this._conditions.reduceRight((finalVal, condition) => finalVal && condition(ctx), true)) {
			logger.debug(`Skipping: ${this.toString()}`, LogCategory.EXECUTION)
			return
		}
		logger.debug(`Executing: ${this.toString()}`, LogCategory.EXECUTION)
		await Promise.all(this._waits_before.map(wait => wait(ctx)))
		await Promise.all([...this._sideffects.map(sideffect => sideffect.execute(ctx)), this.action(ctx)])
		return Promise.all(this._waits_after.map(wait => wait(ctx)))
	}

	/**
	 * Method that represents this action's implementation
	 * @param ctx - The object that contains all of the components needed by an action to execute (ex. cpu, ram, etc.)
	 */
	protected abstract action(ctx: ExecutionContext): Promise<any>

	/**
	 * Returns true if this action is marked as the last action of a microstep
	 * @returns
	 */
	doesEndStep() {
		return this._endsStep
	}

	/**
	 * Returns true if this action is marked as the last action of an instruction
	 * @returns
	 */
	doesEndInstruction() {
		return this._endsInstruction
	}

	toString(): string {
		return `${this._name}`
	}
}
