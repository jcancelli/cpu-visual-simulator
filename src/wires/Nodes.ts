import Node from "./Node"

// invisible wire starts 8px from the center of the wire it crosses and ends 8px after

export const DataBusNodes = [
	new Node("RAM:DATA", 1250, 115),
	new Node("DATA:1", 1250, 85),
	new Node("DATA:2", 749, 85),
	new Node("DATA:3", 527, 85),
	new Node("DATA:4", 262, 85),
	new Node("DATA:5", 95, 85),
	new Node("DATA:6", 95, 390),
	new Node("DATA:7", 95, 617),
	new Node("DATA:8", 320, 390),
	new Node("DATA:9", 312, 250),
	new Node("DATA:10", 477, 250),
	new Node("DATA:11", 652, 490),
	new Node("IR:1", 262, 151),
	new Node("IR:2", 312, 180),
	new Node("IR:3", 212, 180),
	new Node("MUX:1", 477, 292),
	new Node("MUX:2", 527, 292),
	new Node("MUX:3", 502, 332),
	new Node("ACC:1", 327, 617),
	new Node("ACC:2", 412, 601),
	new Node("ALU:1", 320, 432),
	new Node("ALU:2", 502, 432),
	new Node("ALU:3", 526, 490),
	new Node("ALU:4", 412, 538),
	new Node("SW:1", 652, 601)
] as const

const AddressBusNodes = [
	new Node("RAM:ADD", 1058, 250),
	new Node("ADD:1", 749, 250),
	new Node("ADD:2", 670, 250),
	new Node("ADD:3", 590, 250),
	new Node("ADD:4", 590, 137),
	new Node("ADD:5", 535, 250),
	new Node("ADD:6", 519, 250),
	new Node("INC:1", 670, 210),
	new Node("INC:2", 670, 182),
	new Node("PC:1", 670, 150),
	new Node("PC:2", 622, 137)
] as const

const ControlBusNodes = [
	new Node("RAM:CTRL", 1058, 370),
	new Node("CTRL:1", 749, 370),
	new Node("CTRL:2", 507, 370),
	new Node("CTRL:3", 494, 370),
	new Node("CTRL:4", 240, 370),
	new Node("CTRL:5", 185, 382),
	new Node("CTRL:6", 185, 398),
	new Node("CTRL:7", 185, 490),
	new Node("CU:1", 212, 281),
	new Node("CU:2", 270, 313),
	new Node("CU:3", 240, 340),
	new Node("CU:4", 185, 340),
	new Node("MUX:4", 464, 313),
	new Node("ALU:5", 297, 490)
] as const

export const Nodes = [...DataBusNodes, ...AddressBusNodes, ...ControlBusNodes] as const

export function node(name: string): Node {
	return Nodes.find(n => n.name === name)
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

export default Nodes
