import { Cache } from "../execution"

export default abstract class Action {
	protected _endsStep: boolean
	protected _sideffects: Action[]
	protected _condition: (cache: Cache) => boolean // returns if an action should be executed when method execute is called

	constructor() {
		this._endsStep = false
		this._sideffects = []
		this._condition = () => true
	}

	condition(condition: (cache: Cache) => boolean): Action {
		this._condition = condition
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
		if (!this._condition(cache)) {
			return
		}
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
