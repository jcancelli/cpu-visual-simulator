import type { UInt } from "$lib/types/integer"
import { assertMemoryOperation, type MemoryOperation } from "$lib/types/memory"
import { ByteBusImpl, type ByteBus, type Signal } from "./bus.svelte"

/** Bus that carries a valid memory operation */
export interface MemoryOperationBus extends ByteBus {
	/** The memory operation transmitted by this bus or no signal */
	get memoryOperation(): Signal<MemoryOperation>
}

/** Implementation of {@link MemoryOperationBus} */
export class MemoryOperationBusImpl extends ByteBusImpl implements MemoryOperationBus {
	get memoryOperation(): Signal<MemoryOperation> {
		return this.unsigned as Signal<MemoryOperation>
	}

	protected override assertValid(value: UInt<8>): void {
		assertMemoryOperation(value)
	}
}
