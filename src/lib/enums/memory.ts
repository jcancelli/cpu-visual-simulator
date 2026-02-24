import { InvalidMemoryOperationError } from "$lib/errors/memory"

/** Operation that can be signaled to the memory on the control bus */
export enum MemoryOperation {
	READ = 0b1,
	WRITE = 0b10,
	FETCH = 0b100,
}

/** Check if the specified value is a valid {@link MemoryOperation} */
export function isMemoryOperation(value: number): value is MemoryOperation {
	return value === MemoryOperation.READ || value === MemoryOperation.WRITE
}

/** Assert that the specified value is a valid {@link MemoryOperation}
 * @throws {InvalidMemoryOperationError}*/
export function assertMemoryOperation(value: number): asserts value is MemoryOperation {
	if (!isMemoryOperation(value)) {
		throw new InvalidMemoryOperationError(value)
	}
}
