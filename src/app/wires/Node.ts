import Wire from "./Wire"
import WireType from "./WireType"

export interface Position {
	x: number
	y: number
}

export default class Node implements Position {
	readonly x: number
	readonly y: number
	readonly name: string
	readonly neighbours: Node[]
	readonly intersectionType: WireType

	constructor(name: string, x: number, y: number, intersectionType: WireType = null) {
		this.x = x
		this.y = y
		this.name = name
		this.neighbours = []
		this.intersectionType = intersectionType
	}

	isAlignedTo(node: Position): boolean {
		return this.x === node.x || this.y === node.y
	}

	isConnectedTo(node: Position): boolean {
		return this.neighbours.some(n => n === node)
	}

	connectTo(node: Node, wire: Wire): void {
		if (!this.isAlignedTo(node)) {
			throw new Error(
				"Cannot connect 2 nodes that are not aligned (nodeA: " + this.name + " nodeB: " + node.name + ")"
			)
		}
		if (this.isConnectedTo(node)) {
			throw new Error("This node is already connected to " + node.name)
		}
		this.neighbours.push(node)
		node.neighbours.push(this)
	}

	static distance(a: Position, b: Position): number {
		return Math.hypot(a.x - b.x, a.y - b.y)
	}

	static direction(a: Position, b: Position): { x: number; y: number } {
		if (a.x > b.x) {
			return { x: -1, y: 0 }
		} else if (a.x < b.x) {
			return { x: 1, y: 0 }
		} else {
			if (a.y > b.y) {
				return { x: 0, y: -1 }
			} else {
				return { x: 0, y: 1 }
			}
		}
	}
}
