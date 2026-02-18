/** Utility function to mark a branch of code as unreachable.
 * @throws {UnreachableError} */
export function unreachable(message?: string): never {
	throw new UnreachableError(message)
}

/** Error thrown when {@link unreachable} is encountered. */
export class UnreachableError extends Error {}

/** Utility function to be used as a todo marker.
 * @throws {TODOError} */
export function todo(message?: string): never {
	throw new TODOError(message)
}

/** Error thrown when {@link todo} is encountered. */
export class TODOError extends Error {}

/** Utility function to be used as an unimplemented marker.
 * @throws {UnimplementedError} */
export function unimplemented(message?: string): never {
	throw new UnimplementedError(message)
}

/** Error thrown when {@link unimplemented} is encountered. */
export class UnimplementedError extends Error {}
