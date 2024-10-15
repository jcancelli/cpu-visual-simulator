import { InvalidArgumentError } from "$lib/errors/util"

/** Parameter object for the {@link import("./graph").WireGraph} constructor */
export class NodeBlueprint {
	constructor(
		/** ID of the node. Cannot be empty */
		public readonly id: string,
		/** x coordinate of the node normalized in range [0, 1] */
		public readonly x: number,
		/** y coordinate of the node normalized in range [0, 1] */
		public readonly y: number
	) {
		if (x < 0.0 || x > 1.0 || y < 0.0 || y > 1.0) {
			throw new InvalidArgumentError(`Node coordinates (${x}, ${y}) are not between 0.0 and 1.0`)
		}
		if (!id || id === "") {
			throw new InvalidArgumentError("Invalid Node id")
		}
	}
}

/** Node inside a {@link import("./graph").WireGraph} instance. Should not be created directly. */
export class Node {
	constructor(
		/** ID of the node */
		public readonly id: string,
		/** x coordinate of the node normalized in range [0, 1] */
		public readonly x: number,
		/** y coordinate of the node normalized in range [0, 1] */
		public readonly y: number,
		/** Nodes connected to this node */
		public readonly neighbours: Map<string, Node> = new Map()
	) {}
}
