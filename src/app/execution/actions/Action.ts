import Logger from "../../util/logger"
import { Condition } from "./Conditions"
import { Wait } from "./Waits"

export default abstract class Action {
	protected _name: string // needed because bundler alters this.constructor.name
	protected _endsStep: boolean
	protected _sideffects: Action[] // actions executed at the same time as this action (only if this action's conditions equal to true)
	protected _conditions: Condition[] = [] // conditions that determine wether the action is executed or not
	protected _waits_before: Wait[] // promises awaited before executing the action
	protected _waits_after: Wait[] // promises awaited after executing the action (before resolving the action's promise)

	constructor() {
		this._name = "Action"
		this._endsStep = false
		this._sideffects = []
		this._conditions = []
		this._waits_before = []
		this._waits_after = []
	}

	condition(condition: Condition): Action {
		this._conditions.push(condition)
		return this
	}

	endstep(): Action {
		this._endsStep = true
		return this
	}

	sideffects(...sideffects: Action[]): Action {
		this._sideffects.push(...sideffects)
		return this
	}

	waitFor(...waits: Wait[]): Action {
		this._waits_before.push(...waits)
		return this
	}

	thenWaitFor(...waits: Wait[]): Action {
		this._waits_after.push(...waits)
		return this
	}

	async execute(): Promise<any> {
		if (!this._conditions.reduceRight((finalVal, condition) => finalVal && condition(), true)) {
			Logger.info(`Skipping: ${this.toString()}`, "EXECUTION")
			return
		}
		Logger.info(`Executing: ${this.toString()}`, "EXECUTION")
		await Promise.all(this._waits_before.map(wait => wait()))
		await Promise.all([...this._sideffects.map(sideffect => sideffect.execute()), this.action()])
		return Promise.all(this._waits_after.map(wait => wait()))
	}

	protected abstract action(): Promise<any>

	doesEndStep() {
		return this._endsStep
	}

	toString(): string {
		return `${this._name}`
	}
}
