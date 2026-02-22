import type { U16 } from "$lib/integer"
import { unreachable } from "$lib/util/development"
import type { AddressBus, AddressingModeBus, WordBus } from "./bus.svelte"
import { CPUError } from "./cpu.svelte"

/** From which bus the operand should be read */
export enum AddressingMode {
	/** The operand is read from the data bus */
	DIRECT = 0b1,
	/** The operand is read from the bus connected to the instruction register operand */
	IMMEDIATE = 0b10,
}

/** Check if a given value is a valid {@link AddressingMode} value */
export function isValidAddressingMode(value: number): value is AddressingMode {
	return value === AddressingMode.IMMEDIATE || value === AddressingMode.DIRECT
}

/** Asserts that a given value is a valid {@link AddressingMode} value.
 * @throws {InvalidAddressingModeError} */
export function assertAddressingMode(value: number): asserts value is AddressingMode {
	if (!isValidAddressingMode(value)) {
		throw new InvalidAddressingModeError(value)
	}
}

/** The state of the multiplexer */
export class Multiplexer {
	/** The currently selected addressing mode */
	private _addressingMode: AddressingMode
	/** The signal that this MUX is repeating */
	private signal: U16
	/** The bus connected to the instruction register opcode */
	private opcodeBus: AddressBus
	/** The data bus */
	private dataBus: WordBus
	/** The bus connected to the ALU */
	private aluBus: WordBus
	/** The bus connected to the control unit */
	private controlBus: AddressingModeBus

	constructor(
		opcodeBus: AddressBus,
		dataBus: WordBus,
		aluBus: WordBus,
		controlBus: AddressingModeBus,
	) {
		this._addressingMode = $state(AddressingMode.DIRECT)
		this.signal = $state(0 as U16)
		this.opcodeBus = opcodeBus
		this.dataBus = dataBus
		this.aluBus = aluBus
		this.controlBus = controlBus
	}

	/** The currently selected addressing mode */
	get addressingMode(): AddressingMode {
		return this._addressingMode
	}

	/** Set the vaue of the repeated signal to the value found on the bus selected by the current {@link AddressingMode}.
	 * @throws {NoSignalError} */
	readSignal(): void {
		switch (this._addressingMode) {
			case AddressingMode.DIRECT:
				this.signal = this.dataBus.readSignalOrThrow()
				break

			case AddressingMode.IMMEDIATE:
				this.signal = this.opcodeBus.readSignalOrThrow() as unknown as U16
				break

			default:
				unreachable()
		}
	}

	/** Send the repeated signal value to the bus connected to the ALU */
	sendSignal(): void {
		this.aluBus.sendSignal(this.signal)
	}

	/** Set the value of the current {@link AddressingMode} to the value found on the bus connected to the control unit.
	 * @throws {NoSignalError} */
	readAddressingModeSignal(): void {
		this._addressingMode = this.controlBus.readSignalOrThrow()
	}
}

/** Error regarding an invalid {@link AddressingMode} value */
export class InvalidAddressingModeError extends CPUError {
	/** The invalid value that caused the error */
	public readonly value: number

	constructor(value: number) {
		super(`Invalid addressing mode: ${value.toString(2)}`)
		this.value = value
	}
}
