import Action from "../Action"
import Macro from "./Macro"

export default class Sequantial extends Macro {
	constructor(...subactions: Action[]) {
		super(...subactions)
	}

	protected async action(): Promise<any> {
		for (let action of this.subactions) {
			await action.execute()
		}
	}
}
