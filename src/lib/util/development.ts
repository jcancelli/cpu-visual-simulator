/** Utility function to mark a branch of code as unreachable. */
export function unreachable(message?: string): never {
	throw new UnreachableError(message)
}

/** Error thrown when {@link unreachable} is encountered. */
class UnreachableError extends Error {}

/** Utility function to mark a branch of code as unimplemented. */
export function todo(message?: string): never {
	throw new UnimplementedError(message)
}

/** Error thrown when {@link todo} is encountered. */
class UnimplementedError extends Error {}
