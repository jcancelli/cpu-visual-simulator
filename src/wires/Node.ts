import Wire from "./Wire"

export interface Position {
	x: number
	y: number
}

export default class Node implements Position {
	readonly x: number
	readonly y: number
	readonly name: string
	readonly neighbours: Node[]

	constructor(name, x, y) {
		this.x = x
		this.y = y
		this.name = name
		this.neighbours = []
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
				"Cannot connect 2 nodes that are not aligned (nodeA: " +
					this.name +
					" nodeB: " +
					node.name +
					")"
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

// https://stackoverflow.com/questions/32527026/shortest-path-in-javascript/32527538#32527538
export function path(from: Node, to: Node) {
	const toVisit = [from]
	const visited = new Set<Node>()
	const predecessor = {}
	let tail = 0
	while (tail < toVisit.length) {
		let node = toVisit[tail++]
		for (const neighbour of node.neighbours) {
			if (visited.has(neighbour)) {
				continue
			}
			visited.add(neighbour)
			if (neighbour === to) {
				const path = [neighbour]
				while (node !== from) {
					path.push(node)
					node = predecessor[node.name]
				}
				path.push(node)
				path.reverse()
				return path
			}
			predecessor[neighbour.name] = node
			toVisit.push(neighbour)
		}
	}
	throw new Error("No path connecting " + from.name + " to " + to.name)
}
