import type { AddressBus, ByteBus, WordBus } from "./bus.svelte"
import { i16, u16LSB, u16MSB, type I16, type U16, type U8 } from "$lib/integer"
import type { WordAlignedAddress } from "./memory.svelte"

/** State of the instruction register */
export class InstructionRegister {
	private _unsigned: U16
	/** The data bus */
	private dataBus: WordBus
	/** The bus connected to the decoder */
	private opcodeBus: ByteBus
	/** The address bus and the bus connected to the MUX */
	private operandBus: AddressBus

	constructor(dataBus: WordBus, opcodeBus: ByteBus, operandBus: AddressBus) {
		this._unsigned = $state(0 as U16)
		this.dataBus = dataBus
		this.opcodeBus = opcodeBus
		this.operandBus = operandBus
	}

	get msb(): U8 {
		return u16MSB(this._unsigned)
	}

	get lsb(): U8 {
		return u16LSB(this._unsigned)
	}

	get signed(): I16 {
		return i16(this._unsigned)
	}

	get unsigned(): U16 {
		return this._unsigned
	}

	/** Set the instruction register value to the value found on the data bus.
	 * @throws {NoSignalError} */
	readDataSignal(): void {
		this._unsigned = this.dataBus.readSignalOrThrow()
	}

	/** Send the value of the opcode on the bus connected to the decoder */
	sendOpcodeSignal(): void {
		this.opcodeBus.sendSignal(this.msb)
	}

	/** Send the value of the operand to the address bus
	 * @throws {InvalidBusSignalError} */
	sendOperandSignal(): void {
		this.operandBus.sendSignal(this.lsb as WordAlignedAddress)
	}
}
