import Action from "../Action"

export default abstract class Macro extends Action {
	protected readonly subactions: Action[]

	constructor(...subactions: Action[]) {
		super()
		this.subactions = [...subactions]
	}
}
