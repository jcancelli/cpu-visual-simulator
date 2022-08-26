import Action from "../Action"

export default abstract class RamAction extends Action {
	constructor() {
		super()
		this._name = "RamAction"
	}
}
