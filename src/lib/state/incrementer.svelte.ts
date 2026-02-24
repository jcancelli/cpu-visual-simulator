import {
	assertWordAlignedAddress,
	WORD_ALIGNMENT,
	type WordAlignedAddress,
} from "$lib/types/address"
import type { Bus } from "./bus.svelte"

/** State of the program counter incrementer */
export default class ProgramCounterIncrementer {
	private signal: WordAlignedAddress
	private addressBus: Bus<8>

	constructor(addressBus: Bus<8>) {
		this.signal = $state(0 as WordAlignedAddress)
		this.addressBus = addressBus
	}

	/** Read the signal from the address bus and store its incremented value internally */
	readSignal(): void {
		const signal = this.addressBus.readSignalUnsignedOrThrow()
		assertWordAlignedAddress(signal)
		this.signal = (signal + WORD_ALIGNMENT) as WordAlignedAddress
	}

	/** Send the incremented address on the  */
	sendSignal(): void {
		this.addressBus.sendSignalUnsigned(this.signal)
	}
}
