import Node from "./Node"
import type { WireType } from "./WireType"

export default class Wire {
	readonly a: Node
	readonly b: Node
	readonly type: WireType
	readonly linecap: boolean
	static readonly WIDTH = 5

	constructor(a: Node, b: Node, type: WireType, linecap: boolean = true) {
		this.a = a
		this.b = b
		this.type = type
		this.a.connectTo(b, this)
		this.linecap = linecap
	}

	isConnecting(a: Node, b: Node): boolean {
		return (this.a === a && this.b === b) || (this.a === b && this.b === a)
	}
}
