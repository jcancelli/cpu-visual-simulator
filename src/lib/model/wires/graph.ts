import { InvalidArgumentError } from "$lib/errors/util"
import { Node, type NodeBlueprint } from "./node"
import { Wire, type WireBlueprint } from "./wire"
import { WireConfig, type WireConfigBlueprint } from "./wire_config"

/** Parameter object for the {@link WiresGraph} constructor */
export type WireGraphBlueprint = {
	nodes: NodeBlueprint[]
	wires: WireBlueprint[]
	wireConfigs: WireConfigBlueprint[]
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

	constructor({ nodes, wires, wireConfigs }: WireGraphBlueprint) {
		for (const node of nodes) {
			this.addNode(node)
		}

		for (const config of wireConfigs) {
			this.addWireConfig(config)
		}

		for (const { a, b, config } of wires) {
			this.connect(a, b, config)
		}
	}

	/** Add a new node */
	addNode({ id, x, y }: NodeBlueprint) {
		if (this.nodes.has(id)) {
			throw new InvalidArgumentError(`Duplicate node "${id}"`)
		}
		this.nodes.set(id, new Node(id, x, y))
	}

	/** Remove a node */
	removeNode(nodeToRemove: string | Node) {
		if (!nodeToRemove) {
			throw new InvalidArgumentError("Invalid node")
		}
		const nodeID = typeof nodeToRemove === "string" ? nodeToRemove : nodeToRemove.getID()
		const node = this.nodes.get(nodeID)
		if (!node) {
			throw new InvalidArgumentError(`Node "${nodeID}" does not exist`)
		}
		for (const neighbour of node.getNeighbours()) {
			this.disconnect(node.getID(), neighbour.getID())
		}
		this.nodes.delete(nodeID)
	}

	/** Add a wire configuration */
	addWireConfig({ id, width, baseColor, animationColor }: WireConfigBlueprint) {
		if (this.wireConfigs.has(id)) {
			throw new InvalidArgumentError(`Duplicate wire configuration "${id}"`)
		}
		const config = new WireConfig(id, width, baseColor, animationColor)
		this.wireConfigs.set(id, config)
	}

	/** Remove a wire configuration */
	removeWireConfig(configID: string) {
		if (!this.wireConfigs.has(configID)) {
			throw new InvalidArgumentError(`Wire configuration "${configID}" does not exist`)
		}
		if (this.getWires().findIndex(wire => wire.getConfig().getID() === configID) !== -1) {
			throw new InvalidArgumentError(`Cannot remove configuration "${configID}" because in use`)
		}
		this.wireConfigs.delete(configID)
	}

	/** Connect two nodes with a wire */
	connect(a: string, b: string, configID: string) {
		const nodeA = this.nodes.get(a)
		const nodeB = this.nodes.get(b)
		const config = this.wireConfigs.get(configID)
		if (!nodeA) {
			throw new InvalidArgumentError(`Node "${a}" does not exist`)
		}
		if (!nodeB) {
			throw new InvalidArgumentError(`Node "${b}" does not exist`)
		}
		if (a === b) {
			throw new InvalidArgumentError(`Cannot connect node "${a}" with itself`)
		}
		if (!config) {
			throw new InvalidArgumentError(`Wire configuration "${configID}" does not exist`)
		}
		if (nodeA.isConnectedTo(nodeB)) {
			throw new InvalidArgumentError(`Node "${a}" and "${b}" are already connected`)
		}
		nodeA.connect(nodeB)
		nodeB.connect(nodeA)
		const wire = new Wire(nodeA, nodeB, config)
		this.wires.set(connectionKey(nodeA, nodeB), wire)
		this.wires.set(connectionKey(nodeB, nodeA), wire)
		this.pathCache.clear()
	}

	/** Disconnect two nodes */
	disconnect(a: string, b: string) {
		const nodeA = this.nodes.get(a)
		const nodeB = this.nodes.get(b)
		if (!nodeA) {
			throw new InvalidArgumentError(`Node "${a}" does not exist`)
		}
		if (!nodeB) {
			throw new InvalidArgumentError(`Node "${b}" does not exist`)
		}
		if (!nodeA.isConnectedTo(nodeB)) {
			return
		}
		nodeA.disconnect(nodeB)
		nodeB.disconnect(nodeA)
		this.wires.delete(connectionKey(nodeA, nodeB))
		this.wires.delete(connectionKey(nodeB, nodeA))
		this.pathCache.clear()
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
		let wire = this.wires.get(connectionKey(nodeA, nodeB)) ?? null
		wire = wire ?? this.wires.get(connectionKey(nodeB, nodeA)) ?? null
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

	/**
	 * Return an array of sets of nodes. A node in each set is connected (directy/indirectly)
	 * to every other node in the same set. Nodes in different sets do not share any connection */
	getSubGraphs(): Set<Node>[] {
		const subgraphs: Set<Node>[] = []
		const visited: Set<Node> = new Set()
		for (const node of this.getNodes()) {
			getSubgraphRecursive(node, subgraphs, visited)
		}
		return subgraphs
	}

	/** Return the path between the two specified nodes. Throws an error if the path does not exist */
	getPath(fromNodeID: string, toNodeID: string): Path {
		if (!this.nodes.has(fromNodeID)) {
			throw new InvalidArgumentError(`Node "${fromNodeID}" does not exist`)
		}
		if (!this.nodes.has(toNodeID)) {
			throw new InvalidArgumentError(`Node "${toNodeID}" does not exist`)
		}
		const key = connectionKey(fromNodeID, toNodeID)
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
		this.pathCache.set(connectionKey(fromNodeID, toNodeID), path)
		this.pathCache.set(connectionKey(toNodeID, fromNodeID), {
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
			for (const neighbour of node.getNeighbours()) {
				if (visited.has(neighbour.getID())) {
					continue
				}
				visited.add(neighbour.getID())
				if (neighbour.getID() === to.getID()) {
					const path = [neighbour]
					while (node.getID() !== from.getID()) {
						path.push(node)
						node = predecessor.get(node.getID())!
					}
					path.push(node)
					path.reverse()
					return path
				}
				predecessor.set(neighbour.getID(), node)
				toVisit.push(neighbour)
			}
		}

		throw new Error(`No path connecting "${fromNodeID}" and "${toNodeID}"`)
	}

	/** Return all the wires connecting the specified nodes */
	private buildWiresPath(nodes: Node[]): Wire[] {
		const wires: Wire[] = []
		for (let i = 0; i < nodes.length - 1; i++) {
			const wireKey = connectionKey(nodes[i], nodes[i + 1])
			if (!this.wires.has(wireKey)) {
				throw new Error(`No wire with key "${wireKey}"`)
			}
			wires.push(this.wires.get(wireKey)!)
		}
		return wires
	}
}

/** Return the string that represent a connection between the two specified nodes */
function connectionKey(from: string | Node, to: string | Node): string {
	if (!from) {
		throw new InvalidArgumentError('Invalid "from" node')
	}
	if (!to) {
		throw new InvalidArgumentError('Invalid "to" node')
	}
	const fromNodeID = typeof from === "string" ? from : from.getID()
	const toNodeID = typeof to === "string" ? to : to.getID()
	return `<${fromNodeID}>:<${toNodeID}>`
}

/** Helper function to Graph.getSubgraphs */
function getSubgraphRecursive(node: Node, subgraphs: Set<Node>[], visited: Set<Node>) {
	if (visited.has(node)) {
		mergeSubgraphsContainingNode(node, subgraphs)
		return
	}
	subgraphs.push(new Set<Node>([node]))
	visited.add(node)
	for (const neighbour of node.getNeighbours()) {
		getSubgraphRecursive(neighbour, subgraphs, visited)
	}
}

/** Finds all subgraphs containing the same node, removes them from the array and adds their union */
function mergeSubgraphsContainingNode(node: Node, subgraphs: Set<Node>[]) {
	const connectedSubgraphsIndexes: number[] = []
	for (let i = 0; i < subgraphs.length; i++) {
		if (subgraphs[i].has(node)) {
			connectedSubgraphsIndexes.push(i)
		}
	}
	const mergedSubgraph = new Set<Node>()
	for (const i of connectedSubgraphsIndexes) {
		for (const element of subgraphs[i]) {
			mergedSubgraph.add(element)
		}
		subgraphs.splice(i, 1)
	}
	subgraphs.push(mergedSubgraph)
}
