import Node from "./Node"

export type WireType = typeof WireType[keyof typeof WireType]

export const WireType = {
	DATA_INT: {
		name: "DATA_INT",
		color: "cyan",
		animationColor: "red"
	},
	DATA_EXT: {
		name: "DATA_EXT",
		color: "blue",
		animationColor: "red"
	},
	CONTROL_INT: {
		name: "CONTROL_INT",
		color: "#ff7a90",
		animationColor: "blue"
	},
	CONTROL_EXT: {
		name: "CONTROL_EXT",
		color: "red",
		animationColor: "blue"
	},
	ADDRESS_INT: {
		name: "ADDRESS_INT",
		color: "yellow",
		animationColor: "green"
	},
	ADDRESS_EXT: {
		name: "ADDRESS_EXT",
		color: "darkorange",
		animationColor: "green"
	},
	INVISIBLE: {
		name: "INVISIBLE",
		color: "transparent",
		animationColor: "transparent"
	}
} as const

export const WIDTH = 5

export default class Wire {
	readonly a: Node
	readonly b: Node
	readonly type: WireType
	readonly linecap: boolean

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
