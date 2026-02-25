import type { U8 } from "$lib/types/integer"
import { assertMemoryOperation, MemoryOperation } from "$lib/types/memory"
import { ByteRegisterImpl, type ByteRegister } from "./register.svelte"

/** Register that can store a valid memory operation value */
export interface MemoryOperationRegister extends ByteRegister {
	/** The value of the memory operation */
	get value(): MemoryOperation
	/** The value of the memory operation.
	 * @throws {InvalidMemoryOperationError} */
	set value(value: MemoryOperation)
}

/** Implementation of {@link MemoryOperationRegister} */
export class StatusWordRegisterImpl extends ByteRegisterImpl implements MemoryOperationRegister {
	constructor(initialValue: MemoryOperation = MemoryOperation.FETCH) {
		super(initialValue as U8)
	}

	get value(): MemoryOperation {
		return this.unsigned as MemoryOperation
	}

	set value(value: MemoryOperation) {
		this.unsigned = value
	}

	protected override assertValid(value: U8): void {
		assertMemoryOperation(value)
	}
}
