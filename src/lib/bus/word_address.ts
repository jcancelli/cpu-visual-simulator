import { assertWordAlignedAddress, type WordAlignedAddress } from "$lib/types/address"
import type { UInt } from "$lib/types/integer"
import { ByteBusImpl, type ByteBus, type Signal } from "./bus.svelte"

/** Bus that carries a valid word address */
export interface WordAddressBus extends ByteBus {
	/** The address transmitted by this bus or no signal */
	get address(): Signal<WordAlignedAddress>
}

/** Implementation of {@link WordAddressBus} */
export class WordAddressBusImpl extends ByteBusImpl implements WordAddressBus {
	get address(): Signal<WordAlignedAddress> {
		return this.unsigned as Signal<WordAlignedAddress>
	}

	protected override assertValid(value: UInt<8>): void {
		assertWordAlignedAddress(value)
	}
}
