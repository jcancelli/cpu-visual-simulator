import Action from "../Action"
import Macro from "./Macro"
import { ExecutionContext } from "../../ExecutionContext"

export default class Sequantial extends Macro {
	constructor(...subactions: Action[]) {
		super(...subactions)
		this._name = "Sequential"
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		for (let action of this.subactions) {
			await action.execute(ctx)
		}
	}
}
