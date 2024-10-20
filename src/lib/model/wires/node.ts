import { InvalidArgumentError } from "$lib/errors/util"
import ListenersManager, { type Listener } from "../listeners_manager"

/** Parameter object for the {@link WireGraph} constructor */
export type NodeBlueprint = {
	/** The ID of the node */
	id: string
	/** X coordinate of the node. Should be a value between 0 and 1 */
	x: number
	/** Y coordinate of the node. Should be a value between 0 and 1 */
	y: number
}

/** Node inside a {@link WireGraph} instance. Should not be created directly. */
export class Node {
	/** Nodes connected to this node */
	private readonly neighbours: Node[] = []
	private readonly positionListeners = new ListenersManager<{ x: number; y: number }>()

	constructor(
		/** ID of the node */
		private readonly id: string,
		/** X coordinate of the node. Should be a value between 0 and 1 */
		private x: number,
		/** Y coordinate of the node. Should be a value between 0 and 1 */
		private y: number
	) {
		if (!id || id === "") {
			throw new InvalidArgumentError("Invalid ID")
		}
		if (x > 1 || x < 0) {
			throw new InvalidArgumentError(`Invalid x value ${x}`)
		}
		if (y > 1 || y < 0) {
			throw new InvalidArgumentError(`Invalid y value ${y}`)
		}
	}

	/** Return node's id */
	getID(): string {
		return this.id
	}

	/** Return node's x coordinate (value between 0 and 1) */
	getX(): number {
		return this.x
	}

	/** Set node's x coordinate (value between 0 and 1) */
	setX(value: number) {
		if (value < 0 || value > 1) {
			throw new InvalidArgumentError(`Invalid x value ${value}`)
		}
		if (this.x === value) {
			return
		}
		this.x = value
		this.positionListeners.notify({ x: this.x, y: this.y })
	}

	/** Return node's y coordinate (value between 0 and 1) */
	getY(): number {
		return this.y
	}

	/** Set node's y coordinate (value between 0 and 1) */
	setY(value: number) {
		if (value < 0 || value > 1) {
			throw new InvalidArgumentError(`Invalid y value ${value}`)
		}
		if (this.y === value) {
			return
		}
		this.y = value
		this.positionListeners.notify({ x: this.x, y: this.y })
	}

	/** Return nodes connected to this node */
	getNeighbours(): Node[] {
		return [...this.neighbours]
	}

	/** Connect a node to this node. Should be called also on other node. Should not be called outside WireGraph */
	connect(node: Node) {
		if (!node) {
			throw new InvalidArgumentError("Invalid node")
		}
		if (this.neighbours.find(neighbour => neighbour.id === node.id)) {
			return
		}
		this.neighbours.push(node)
	}

	/** Disconnect a node from this node. Should be called also on other node. Should not be called outside WireGraph */
	disconnect(node: string | Node) {
		if (!node) {
			throw new InvalidArgumentError("Invalid node")
		}
		const nodeID = typeof node === "string" ? node : node.id
		const removeIndex = this.neighbours.findIndex(neighbour => neighbour.id === nodeID)
		if (removeIndex !== -1) {
			this.neighbours.splice(removeIndex, 1)
		}
	}

	/** Return true if this node is connected to the provided node */
	isConnectedTo(node: string | Node): boolean {
		if (!node) {
			throw new InvalidArgumentError("Invalid node")
		}
		const nodeID = typeof node === "string" ? node : node.id
		const index = this.neighbours.findIndex(neighbour => neighbour.id === nodeID)
		return index !== -1
	}

	/** Add a listener for changes to the node's position */
	addPositionChangedListener(listener: Listener<{ x: number; y: number }>) {
		this.positionListeners.addListener(listener)
	}

	/** Remove a listener for changes to the node's position */
	removePositionChangedListener(listener: Listener<{ x: number; y: number }>) {
		this.positionListeners.removeListener(listener)
	}
}
