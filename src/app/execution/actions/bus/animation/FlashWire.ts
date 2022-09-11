import Animation from "../../Animation"
import { wires as wiresComponent } from "../../../../store/components"

export default class FlashWire extends Animation {
	protected from: string
	protected to: string

	constructor(from: string, to: string) {
		super()
		this._name = "FlashWire"
		this.from = from
		this.to = to
	}

	protected async action(): Promise<any> {
		return wiresComponent.get().flashWire(this.from, this.to)
	}

	toString(): string {
		return `${super.toString()}, from: ${this.from}, to: ${this.to}`
	}
}
