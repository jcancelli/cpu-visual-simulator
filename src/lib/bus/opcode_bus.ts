import type { UInt } from "$lib/types/integer"
import {
	getImmediateFlag,
	getOpcodeByNumeric,
	getOpcodeByNumericOrThrow,
	type Opcode,
} from "$lib/types/opcode"
import { ByteBusImpl, NO_SIGNAL, type ByteBus, type Signal } from "./bus.svelte"

/** Bus that carries a valid opcode */
export interface OpcodeBus extends ByteBus {
	/** The opcode transmitted by this bus or no signal */
	get opcode(): Signal<Opcode>
	/** The immediate flag transmitted by this bus or no signal */
	get immediateFlag(): Signal<boolean>
}

/** Implementation of {@link OpcodeBus} */
export class OpcodeBusImpl extends ByteBusImpl implements OpcodeBus {
	get opcode(): Signal<Opcode> {
		const unsigned = this.unsigned
		if (unsigned === NO_SIGNAL) {
			return NO_SIGNAL
		}
		return getOpcodeByNumeric(unsigned)!
	}

	get immediateFlag(): Signal<boolean> {
		const unsigned = this.unsigned
		if (unsigned === NO_SIGNAL) {
			return NO_SIGNAL
		}
		return getImmediateFlag(unsigned)
	}

	protected override assertValid(opcode: UInt<8>): void {
		getOpcodeByNumericOrThrow(opcode)
	}
}
