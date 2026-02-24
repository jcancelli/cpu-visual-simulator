import type { U8 } from "$lib/types/integer"
import { unreachable } from "$lib/util/development"
import type { Bus } from "./bus.svelte"
import { type Decoder } from "./decoder.svelte"
import { assertMemoryOperation, MemoryOperation as Operation } from "$lib/types/memory"
import { Addressing } from "$lib/types/cpu"

/** State of the control unit */
export class ControlUnit {
	private decoder: Decoder
	/** The currently selected memory operation */
	private _memoryOperation: Operation
	/** Control bus connected to the memory */
	private memoryControlBus: Bus<8>
	/** Control bus connected to the multiplexer */
	private muxControlBus: Bus<8>
	/** Control bus connected to the ALU */
	private aluControlBus: Bus<8>

	constructor(
		decoder: Decoder,
		muxControlBus: Bus<8>,
		aluControlBus: Bus<8>,
		memoryControlBus: Bus<8>,
	) {
		this.decoder = decoder
		this._memoryOperation = $state(Operation.FETCH)
		this.muxControlBus = muxControlBus
		this.aluControlBus = aluControlBus
		this.memoryControlBus = memoryControlBus
	}

	/** The currently selected memory operation */
	get memoryOperation(): Operation {
		return this._memoryOperation
	}

	/** The currently selected memory operation */
	set memoryOperation(operation: Operation) {
		assertMemoryOperation(operation)
		this._memoryOperation = operation
	}

	/** Send the decoded {@link Opcode} to the bus connected to the ALU */
	sendOperationSignal(): void {
		if (!this.decoder.decodeSuccess) {
			unreachable("Execution should have been stopped before this")
		}
		this.aluControlBus.sendSignalUnsigned(this.decoder.decodedOpcode.numeric as U8)
	}

	/** Send the correct {@link Addressing} for the decoded instruction to the bus connected to the multiplexer */
	sendAddressingSignal(): void {
		if (this.decoder.decodedImmediateFlag) {
			this.muxControlBus.sendSignalUnsigned(Addressing.IMMEDIATE as U8)
		} else {
			this.muxControlBus.sendSignalUnsigned(Addressing.DIRECT as U8)
		}
	}

	/** Send the currently selected {@link Operation} to the control bus connected to the memory */
	sendMemoryOperationSignal(): void {
		this.memoryControlBus.sendSignalUnsigned(this._memoryOperation as U8)
	}
}
