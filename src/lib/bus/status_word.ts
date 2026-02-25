import type { UInt } from "$lib/types/integer"
import {
	assertStatusWord,
	getNegativeFlag,
	getZeroFlag,
	type StatusWord,
} from "$lib/types/status_word"
import { ByteBusImpl, NO_SIGNAL, type ByteBus, type Signal } from "./bus.svelte"

/** Bus that carries a valid status word */
export interface StatusWordBus extends ByteBus {
	/** The status word transmitted by this bus or no signal */
	get statusWord(): Signal<StatusWord>
	/** The zero flag transmitted by this bus or no signal */
	get zeroFlag(): Signal<boolean>
	/** The negative flag transmitted by this bus or no signal */
	get negativeFlag(): Signal<boolean>
}

/** Implementation of {@link StatusWordBus} */
export class StatusWordBusImpl extends ByteBusImpl implements StatusWordBus {
	get statusWord(): Signal<StatusWord> {
		return this.unsigned as StatusWord
	}

	get zeroFlag(): Signal<boolean> {
		const statusWord = this.statusWord
		if (statusWord === NO_SIGNAL) {
			return NO_SIGNAL
		}
		return getZeroFlag(statusWord)
	}

	get negativeFlag(): Signal<boolean> {
		const statusWord = this.statusWord
		if (statusWord === NO_SIGNAL) {
			return NO_SIGNAL
		}
		return getNegativeFlag(statusWord)
	}

	protected override assertValid(value: UInt<8>): void {
		assertStatusWord(value)
	}
}
