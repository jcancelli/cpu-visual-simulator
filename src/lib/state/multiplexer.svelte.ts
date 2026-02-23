import { InvalidAddressingModeError } from "$lib/errors/cpu"
import type { U16 } from "$lib/integer"
import { unreachable } from "$lib/util/development"
import type { Bus } from "./bus.svelte"

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
	/** The bus connected to the instruction register operand */
	private instructionRegisterBus: Bus<8>
	/** The data bus */
	private dataBus: Bus<16>
	/** The bus connected to the ALU */
	private aluBus: Bus<16>
	/** The bus connected to the control unit */
	private controlBus: Bus<8>

	constructor(
		instructionRegisterBus: Bus<8>,
		dataBus: Bus<16>,
		aluBus: Bus<16>,
		controlBus: Bus<8>,
	) {
		this._addressingMode = $state(AddressingMode.DIRECT)
		this.signal = $state(0 as U16)
		this.instructionRegisterBus = instructionRegisterBus
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
				this.signal = this.dataBus.readSignalUnsignedOrThrow()
				break

			case AddressingMode.IMMEDIATE:
				this.signal =
					this.instructionRegisterBus.readSignalUnsignedOrThrow() as unknown as U16
				break

			default:
				unreachable()
		}
	}

	/** Send the repeated signal value to the bus connected to the ALU */
	sendSignal(): void {
		this.aluBus.sendSignalUnsigned(this.signal)
	}

	/** Set the value of the current {@link AddressingMode} to the value found on the bus connected to the control unit.
	 * @throws {NoSignalError}
	 * @throws {InvalidAddressingModeError} */
	readAddressingModeSignal(): void {
		const mode = this.controlBus.readSignalUnsignedOrThrow()
		assertAddressingMode(mode)
		this._addressingMode = mode
	}
}
