import Action from "../Action"
import Macro from "./Macro"

export default class Parallel extends Macro {
	constructor(...subactions: Action[]) {
		super(...subactions)
	}

	protected async action(): Promise<any> {
		return Promise.all(this.subactions.map(subaction => subaction.execute()))
	}
}
