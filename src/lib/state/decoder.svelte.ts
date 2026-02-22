import type { U8 } from "$lib/integer"
import { getImmediateFlag, OPCODE_NOP, OPCODES_BY_NUMBER, type Opcode } from "$lib/opcode"
import { type ByteBus } from "./bus.svelte"

/** An opcode that was decoded by the {@link Decoder} */
export type DecodedOpcode = Opcode | typeof INVALID_OPCODE
/** A value that represents an invalid opcode decoded by the {@link Decoder} */
export const INVALID_OPCODE = Symbol("INVALID_OPCODE")

/** State of the decoder */
export class Decoder {
	/** The numeric value of the undecoded opcode */
	private rawOpcode: U8
	/** The opcode that was decoded from the value sent by the instruction register */
	private _decodedOpcode: DecodedOpcode
	/** The immediate flag value that was decoded from the value sent by the instruction register */
	private _decodedImmediateFlag: boolean
	/** The bus connected to the instruction register */
	private opcodeBus: ByteBus

	constructor(opcodeBus: ByteBus) {
		this.rawOpcode = $state(0 as U8)
		this._decodedOpcode = $state(OPCODE_NOP)
		this._decodedImmediateFlag = $state(false)
		this.opcodeBus = opcodeBus
	}

	/** The opcode that was decoded from the value sent by the instruction register */
	get decodedOpcode(): DecodedOpcode {
		return this._decodedOpcode
	}

	/** The immediate flag value that was decoded from the value sent by the instruction register */
	get decodedImmediateFlag(): boolean {
		return this._decodedImmediateFlag
	}

	/** Read the numeric value of the opcode from the bus connected to the instruction register.
	 * @throws {NoSignalError} */
	readOpcodeSignal(): void {
		this.rawOpcode = this.opcodeBus.readSignalOrThrow()
	}

	/** Decode into an opcode the numeric value read from the bus connected to the instruction register */
	decodeOpcode(): void {
		this._decodedOpcode = OPCODES_BY_NUMBER[this.rawOpcode] ?? INVALID_OPCODE
		this._decodedImmediateFlag = getImmediateFlag(this.rawOpcode)
	}
}
