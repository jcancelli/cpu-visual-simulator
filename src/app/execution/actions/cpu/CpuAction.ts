import Action from "../Action"

export default abstract class CpuAction extends Action {
	constructor() {
		super()
		this._name = "CpuAction"
	}
}
