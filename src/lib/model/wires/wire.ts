import { InvalidArgumentError } from "$lib/errors/util"
import type { Node } from "./node"
import type { WireConfig } from "./wire_config"

/** Parameter object used in the {@link Graph} constructor to declare a wire between two nodes */
export type WireBlueprint = {
	a: string
	b: string
	config: string
}

/** Wire that connects two nodes in a {@link Graph} instance. Should not be created directly */
export class Wire {
	constructor(
		private readonly a: Node,
		private readonly b: Node,
		private config: WireConfig
	) {
		if (!a) {
			throw new InvalidArgumentError("Invalid Node")
		}
		if (!b) {
			throw new InvalidArgumentError("Invalid Node")
		}
		if (!config) {
			throw new InvalidArgumentError("Invalid wire configuration")
		}
	}

	getA(): Node {
		return this.a
	}

	getB(): Node {
		return this.b
	}

	getConfig(): WireConfig {
		return this.config
	}

	setConfig(config: WireConfig) {
		if (!config) {
			throw new InvalidArgumentError("Invalid configuration")
		}
		this.config = config
	}
}
