import Animation from "../../Animation"
import { get } from "svelte/store"
import { wires } from "../../../../store/components"

export default class FlashWire extends Animation {
	protected from: string
	protected to: string

	constructor(from: string, to: string) {
		super()
		this.from = from
		this.to = to
	}

	protected async action(): Promise<any> {
		return get(wires).flashWire(this.from, this.to)
	}

	toString(): string {
		return `${super.toString()}, from: ${this.from}, to: ${this.to}`
	}
}
