import { unreachable } from "$lib/util/development"
import type { AddressingModeBus, MemoryOperationBus, OpcodeBus } from "./bus.svelte"
import { INVALID_OPCODE, type Decoder } from "./decoder.svelte"
import { assertMemoryOperation, MemoryOperation } from "./memory.svelte"
import { AddressingMode } from "./multiplexer.svelte"

/** State of the control unit */
export class ControlUnit {
	private decoder: Decoder
	/** The currently selected memory operation */
	private _memoryOperation: MemoryOperation
	/** Control bus connected to the memory */
	private memoryControlBus: MemoryOperationBus
	/** Control bus connected to the multiplexer */
	private muxControlBus: AddressingModeBus
	/** Control bus connected to the ALU */
	private aluControlBus: OpcodeBus

	constructor(
		decoder: Decoder,
		muxControlBus: AddressingModeBus,
		aluControlBus: OpcodeBus,
		memoryControlBus: MemoryOperationBus,
	) {
		this.decoder = decoder
		this._memoryOperation = $state(MemoryOperation.FETCH)
		this.muxControlBus = muxControlBus
		this.aluControlBus = aluControlBus
		this.memoryControlBus = memoryControlBus
	}

	/** The currently selected memory operation */
	get memoryOperation(): MemoryOperation {
		return this._memoryOperation
	}

	/** The currently selected memory operation */
	set memoryOperation(operation: MemoryOperation) {
		assertMemoryOperation(operation)
		this._memoryOperation = operation
	}

	/** Send the decoded {@link Opcode} to the bus connected to the ALU */
	sendOperationSignal(): void {
		if (this.decoder.decodedOpcode === INVALID_OPCODE) {
			unreachable()
		}
		this.aluControlBus.sendSignal(this.decoder.decodedOpcode)
	}

	/** Send the correct {@link AddressingMode} for the decoded instruction to the bus connected to the Multiplexer */
	sendAddressingModeSignal(): void {
		this.muxControlBus.sendSignal(
			this.decoder.decodedImmediateFlag ? AddressingMode.IMMEDIATE : AddressingMode.DIRECT,
		)
	}

	/** Send the currently selected {@link MemoryOperation} to the control bus connected to the memory */
	sendMemoryOperationSignal(): void {
		this.memoryControlBus.sendSignal(this._memoryOperation)
	}
}
