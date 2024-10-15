import { InvalidArgumentError } from "$lib/errors/util"

/** Metadata that defines a "class" of wires inside a {@link import("./graph").WireGraph} instance */
export class WireConfigBlueprint {
	constructor(public readonly id: string) {
		if (!id || id === "") {
			throw new InvalidArgumentError("Invalid id")
		}
	}
}

/**
 * Metadata that defines a "class" of wires inside a {@link import("./graph").WireGraph} instance.
 * Should not be created directly */
export class WireConfig {
	constructor(public readonly id: string) {
		if (!id || id === "") {
			throw new InvalidArgumentError("Invalid ID")
		}
	}
}
