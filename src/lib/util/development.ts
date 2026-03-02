import {
	UnreachableError,
	TODOError,
	UnimplementedError,
	AssertionError,
} from "$lib/errors/development"

/** Empty function, stored in a constant because i don't trust browsers optimizations */
export const EMPTY_FUNC = () => {}

/** Utility function to mark a branch of code as unreachable.
 * @throws {UnreachableError} */
export function unreachable(message?: string): never {
	throw new UnreachableError(message)
}

/** Utility function used as a todo marker.
 * @throws {TODOError} */
export function todo(message?: string): never {
	throw new TODOError(message)
}

/** Utility function used as an unimplemented marker.
 * @throws {UnimplementedError} */
export function unimplemented(message?: string): never {
	throw new UnimplementedError(message)
}

/** Utility function to assert that a condition is true.
 * @throws {AssertionError} */
export function assert(condition: unknown, message?: string): asserts condition is true {
	if (!condition) {
		throw new AssertionError(message)
	}
}
