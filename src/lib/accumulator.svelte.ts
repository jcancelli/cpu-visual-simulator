import type { WordBus } from "./bus.svelte"
import {
	assertI16,
	assertU16,
	i16,
	i16LSB,
	i16MSB,
	u16,
	type I16,
	type U16,
	type U8,
} from "./integer"

/** State of the accumulator */
export class Accumulator {
	private _signed: I16
	/** The bus connected to the ALU */
	private aluBus: WordBus
	/** The data bus */
	private dataBus: WordBus

	constructor(aluBus: WordBus, dataBus: WordBus) {
		this._signed = $state(0 as I16)
		this.aluBus = $state(aluBus)
		this.dataBus = $state(dataBus)
	}

	get msb(): U8 {
		return i16MSB(this._signed)
	}

	get lsb(): U8 {
		return i16LSB(this._signed)
	}

	get signed(): I16 {
		return this._signed
	}

	/** @throws {InvalidI16Error} */
	set signed(value: I16) {
		assertI16(value)
		this._signed = value
	}

	get unsigned(): U16 {
		return u16(this._signed)
	}

	/** @throws {InvalidU16Error} */
	set unsigned(value: U16) {
		assertU16(value)
		this._signed = i16(value)
	}

	/** Set the value of the accumulator to the value sent by the ALU.
	 * @throws {NoSignalError} */
	readAluSignal(): void {
		this.unsigned = this.aluBus.readSignalOrThrow()
	}

	/** Send the value of the accumulator on the data bus */
	sendDataSignal(): void {
		this.dataBus.sendSignal(this.unsigned)
	}
}
