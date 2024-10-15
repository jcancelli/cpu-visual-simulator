import { InvalidArgumentError } from "$lib/errors/util"
import { Node, type NodeDeclaration } from "./node"
import { Wire, type WireDeclaration } from "./wire"
import { WireConfig, type WireConfigDeclaration } from "./wire_config"

/** Parameter object for the {@link WiresGraph} constructor */
export type GraphDeclaration = {
	nodes: NodeDeclaration[]
	wires: WireDeclaration[]
	wireConfigs: WireConfigDeclaration[]
}

/** Path between two {@link Node} objects inside a {@link WiresGraph} instance */
export type Path = {
	fromID: string
	toID: string
	nodes: Node[]
	wires: Wire[]
}

/**
 * Graph composed by {@link Node} objects connected by {@link Wire} objects.
 * Used by the Wires UI component to represent the wires connections. */
export default class WiresGraph {
	/** Cache containing precomputed paths between nodes */
	private readonly pathCache: Map<string, Path> = new Map()
	private readonly nodes: Map<string, Node> = new Map()
	private readonly wires: Map<string, Wire> = new Map()
	private readonly wireConfigs: Map<string, WireConfig> = new Map()

	constructor({ nodes, wires, wireConfigs }: GraphDeclaration) {
		for (const { id, x, y } of nodes) {
			if (this.nodes.has(id)) {
				throw new InvalidArgumentError(`Duplicate Node id: "${id}"`)
			}
			this.nodes.set(id, new Node(id, x, y))
		}

		for (const { id } of wireConfigs) {
			if (this.wireConfigs.has(id)) {
				throw new InvalidArgumentError(`Duplicate WireConfig id: "${id}"`)
			}
			this.wireConfigs.set(id, new WireConfig(id))
		}

		for (const { nodeA, nodeB, configID } of wires) {
			if (!this.nodes.has(nodeA)) {
				throw new InvalidArgumentError(`Node "${nodeA}" does not exists`)
			}
			if (!this.nodes.has(nodeB)) {
				throw new InvalidArgumentError(`Node "${nodeB}" does not exists`)
			}
			if (nodeA === nodeB) {
				throw new InvalidArgumentError(`Cannot create wire connecting node "${nodeA}" with itself`)
			}
			if (!this.wireConfigs.has(configID)) {
				throw new InvalidArgumentError(`WireConfig "${configID}" does not exist`)
			}
			if (this.wires.has(pathKey(nodeA, nodeB)) || this.wires.has(pathKey(nodeB, nodeA))) {
				throw new InvalidArgumentError(`Duplicate wire between "${nodeA}" and "${nodeB}"`)
			}
			const wire = new Wire(
				this.nodes.get(nodeA)!,
				this.nodes.get(nodeB)!,
				this.wireConfigs.get(configID)!
			)
			this.wires.set(pathKey(nodeA, nodeB), wire)
			this.wires.set(pathKey(nodeB, nodeA), wire)
		}
	}

	/** Return ll the nodes in the graph */
	getNodes(): Node[] {
		return this.nodes.values().toArray()
	}

	/** Return the node with specified id */
	getNode(id: string): Node | null {
		return this.nodes.get(id) ?? null
	}

	/** Return all the wires in the graph */
	getWires(): Wire[] {
		return this.wires.values().toArray()
	}

	/** Return the wire connecting the nodes with ids nodeA and nodeB */
	getWire(nodeA: string, nodeB: string): Wire | null {
		let wire = this.wires.get(pathKey(nodeA, nodeB)) ?? null
		wire = wire ?? this.wires.get(pathKey(nodeB, nodeA)) ?? null
		return wire
	}

	/** Return all the wire configurations of the graph */
	getWiresConfigs(): WireConfig[] {
		return this.wireConfigs.values().toArray()
	}

	/** Return the wire configuration with the specified id */
	getWiresConfig(id: string): WireConfig | null {
		return this.wireConfigs.get(id) ?? null
	}

	/** Return the path between the two specified nodes. Throws an error if the path does not exist */
	getPath(fromNodeID: string, toNodeID: string): Path {
		if (!this.nodes.has(fromNodeID)) {
			throw new InvalidArgumentError(`Node "${fromNodeID}" does not exist`)
		}
		if (!this.nodes.has(toNodeID)) {
			throw new InvalidArgumentError(`Node "${toNodeID}" does not exist`)
		}
		const key = pathKey(fromNodeID, toNodeID)
		if (this.pathCache.has(key)) {
			return this.pathCache.get(key)!
		}
		const path = this.buildPath(fromNodeID, toNodeID)
		return path
	}

	/** Create a path object and add it to the cache */
	private buildPath(fromNodeID: string, toNodeID: string): Path {
		const nodes = this.buildNodesPath(fromNodeID, toNodeID)
		const wires = this.buildWiresPath(nodes)
		const path = {
			fromID: fromNodeID,
			toID: toNodeID,
			nodes,
			wires,
		}
		this.pathCache.set(pathKey(fromNodeID, toNodeID), path)
		this.pathCache.set(pathKey(toNodeID, fromNodeID), {
			fromID: toNodeID,
			toID: fromNodeID,
			nodes: nodes.toReversed(),
			wires: wires.toReversed(),
		})
		return path
	}

	/** Return all the nodes forming the shortest path between the two specified nodes */
	private buildNodesPath(fromNodeID: string, toNodeID: string): Node[] {
		const from = this.nodes.get(fromNodeID)
		const to = this.nodes.get(toNodeID)
		if (!from) {
			throw new InvalidArgumentError(`Node "${fromNodeID}" does not exist`)
		}
		if (!to) {
			throw new InvalidArgumentError(`Node "${toNodeID}" does not exist`)
		}

		const toVisit: Node[] = [from]
		const visited: Set<string> = new Set()
		const predecessor: Map<string, Node> = new Map()
		let tail = 0

		while (tail < toVisit.length) {
			let node = toVisit[tail++]
			for (const [neighbourID, neighbour] of node.neighbours) {
				if (visited.has(neighbourID)) {
					continue
				}
				visited.add(neighbourID)
				if (neighbourID === to.id) {
					const path = [neighbour]
					while (node.id !== from.id) {
						path.push(node)
						node = predecessor.get(node.id)!
					}
					path.push(node)
					path.reverse()
					return path
				}
				predecessor.set(neighbourID, node)
				toVisit.push(neighbour)
			}
		}

		throw new Error(`No path connecting "${fromNodeID}" and "${toNodeID}"`)
	}

	/** Return all the wires connecting the specified nodes */
	private buildWiresPath(nodes: Node[]): Wire[] {
		const wires: Wire[] = []
		for (let i = 0; i < nodes.length - 1; i++) {
			const wireKey = pathKey(nodes[i].id, nodes[i + 1].id)
			if (!this.wires.has(wireKey)) {
				throw new Error(`No wire with key "${wireKey}"`)
			}
			wires.push(this.wires.get(wireKey)!)
		}
		return wires
	}
}

/** Return the string that represent a connection between the two specified nodes */
function pathKey(fromNodeID: string, toNodeID: string): string {
	return `<${fromNodeID}>:<${toNodeID}>`
}
