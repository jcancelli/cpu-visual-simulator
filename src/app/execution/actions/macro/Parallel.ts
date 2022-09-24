import Action from "../Action"
import Macro from "./Macro"
import { ExecutionContext } from "../../ExecutionContext"

export default class Parallel extends Macro {
	constructor(...subactions: Action[]) {
		super(...subactions)
		this._name = "Parallel"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		return Promise.all(this.subactions.map(subaction => subaction.execute(ctx)))
	}
}
