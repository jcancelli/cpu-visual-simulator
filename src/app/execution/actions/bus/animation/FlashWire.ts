import { ExecutionContext } from "../../../ExecutionContext"
import Animation from "../../Animation"

export default class FlashWire extends Animation {
	protected from: string
	protected to: string

	constructor(from: string, to: string) {
		super()
		this._name = "FlashWire"
		this.from = from
		this.to = to
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		return ctx.wires.component.flashWire(this.from, this.to)
	}

	toString(): string {
		return `${super.toString()}, from: ${this.from}, to: ${this.to}`
	}
}
