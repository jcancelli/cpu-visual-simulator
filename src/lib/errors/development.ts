import { CPUVSError } from "./cpuvs"

/** Error thrown when {@link unreachable} is encountered. */
export class UnreachableError extends CPUVSError {}

/** Error thrown when {@link todo} is encountered. */
export class TODOError extends CPUVSError {}

/** Error thrown when {@link unimplemented} is encountered. */
export class UnimplementedError extends CPUVSError {}

/** Error thrown when the {@link assert} condition evaluates to false */
export class AssertionError extends CPUVSError {}
