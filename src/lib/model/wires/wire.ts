import { InvalidArgumentError } from "$lib/errors/util"
import EventBus, { type EventListener } from "$lib/utility/event_bus"
import type { Node } from "./node"
import type { WireConfig } from "./wire_config"

/** Parameter object used in the {@link Graph} constructor to declare a wire between two nodes */
export type WireBlueprint = {
	/** The ID of the first node the wire is connecting */
	a: string
	/** The ID of the second node the wire is connecting */
	b: string
	/** The ID of the configuration of the wire */
	config: string
}

type WireEvents = "config-changed"
type WireEventsTypes = {
	"config-changed": WireConfig
}

/** Wire that connects two nodes in a {@link Graph} instance. Should not be created directly */
export class Wire {
	private readonly eventBus = new EventBus<WireEvents, WireEventsTypes>()

	constructor(
		/** The first node the wire is connecting */
		private readonly a: Node,
		/** The second node the wire is connecting */
		private readonly b: Node,
		/** The configuration of the wire */
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

	/** Return the first node the wire is connecting */
	getA(): Node {
		return this.a
	}

	/** Return the second node the wire is connecting */
	getB(): Node {
		return this.b
	}

	/** Return the wire's configuration */
	getConfig(): WireConfig {
		return this.config
	}

	/** Set the wire's configuration */
	setConfig(config: WireConfig) {
		if (!config) {
			throw new InvalidArgumentError("Invalid configuration")
		}
		if (this.config === config) {
			return
		}
		this.config = config
		this.eventBus.notify("config-changed", config)
	}

	/**
	 * Add a listener for changes to the wire's configuration. The listeners won't be notified
	 * for changes to values inside the configuration, they will only be notified if the
	 * configuration has changed to a new one. For listening to changes to values inside the
	 * configuration, add listeners directly to the configuration. */
	addConfigChangedListener(listener: EventListener<WireConfig>) {
		this.eventBus.addListener("config-changed", listener)
	}

	/** Remove a listener for changes to the wire's configuration */
	removeConfigChangedListener(listener: EventListener<WireConfig>) {
		this.eventBus.removeListener("config-changed", listener)
	}
}
