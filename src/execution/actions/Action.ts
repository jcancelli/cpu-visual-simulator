import Logger from "../../util/Logger"
import { Cache } from "../execution"
import { Condition } from "./Conditions"

export default abstract class Action {
	protected _endsStep: boolean
	protected _sideffects: Action[]
	protected _conditions: Condition[] = [] // returns if an action should be executed when method execute is called

	constructor() {
		this._endsStep = false
		this._sideffects = []
		this._conditions = []
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

	async execute(cache: Cache): Promise<any> {
		if (
			!this._conditions.reduceRight((finalVal, condition) => finalVal && condition(cache), true)
		) {
			return
		}
		Logger.info(`Executing: ${this.toString()}`, "EXECUTION")
		const promises = [
			...this._sideffects.map(sideffect => sideffect.execute(cache)),
			this.action(cache)
		]
		return Promise.all(promises)
	}

	protected abstract action(cache: Cache): Promise<any>

	doesEndStep() {
		return this._endsStep
	}

	toString(): string {
		return `${this.constructor.name} endStep:${this._endsStep}, sideffects:[${this._sideffects.length}]`
	}
}
