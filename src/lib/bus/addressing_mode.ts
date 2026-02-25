import { assertAddressing, type Addressing } from "$lib/types/cpu"
import type { UInt } from "$lib/types/integer"
import { ByteBusImpl, type ByteBus, type Signal } from "./bus.svelte"

/** Bus that carries a valid addressing mode */
export interface AddressingModeBus extends ByteBus {
	/** The addressing mode transmitted by this bus or no signal */
	get addressingMode(): Signal<Addressing>
}

/** Implementation of {@link AddressingModeBus} */
export class AddressingModeBusImpl extends ByteBusImpl implements AddressingModeBus {
	get addressingMode(): Signal<Addressing> {
		return this.unsigned as Signal<Addressing>
	}

	protected override assertValid(mode: UInt<8>): void {
		assertAddressing(mode)
	}
}
