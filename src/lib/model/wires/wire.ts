import { InvalidArgumentError } from "$lib/errors/util"
import type { Node } from "./node"
import type { WireConfig } from "./wire_config"

/** Parameter object used in the {@link Graph} constructor to declare a wire between two nodes */
export class WireBlueprint {
	constructor(
		public readonly nodeA: string,
		public readonly nodeB: string,
		public readonly configID: string
	) {
		if (!nodeA || nodeA === "") {
			throw new InvalidArgumentError("Invalid Node id")
		}
		if (!nodeB || nodeB === "") {
			throw new InvalidArgumentError("Invalid Node id")
		}
		if (!configID || configID === "") {
			throw new InvalidArgumentError("Invalid WireConfig ID")
		}
	}
}

/** Wire that connects two nodes in a {@link Graph} instance. Should not be created directly */
export class Wire {
	constructor(
		public readonly a: Node,
		public readonly b: Node,
		public readonly config: WireConfig
	) {}
}
