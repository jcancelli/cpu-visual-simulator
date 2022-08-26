import Action from "../Action"

export default abstract class Macro extends Action {
	protected readonly subactions: Action[]

	constructor(...subactions: Action[]) {
		super()
		this._name = "Macro"
		this.subactions = [...subactions]
	}

	toString(): string {
		return `${super.toString()} [${this.subactions.length}]`
	}
}
