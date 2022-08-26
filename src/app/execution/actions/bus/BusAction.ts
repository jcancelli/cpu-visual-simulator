import Action from "../Action"

export default abstract class BusAction extends Action {
	constructor() {
		super()
		this._name = "BusAction"
	}
}
