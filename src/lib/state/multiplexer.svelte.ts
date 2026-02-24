import { Addressing, assertAddressing } from "$lib/types/cpu"
import type { U16 } from "$lib/types/integer"
import { unreachable } from "$lib/util/development"
import type { Bus } from "./bus.svelte"

/** The state of the multiplexer */
export class Multiplexer {
	/** The currently selected addressing mode */
	private _addressingMode: Addressing
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
		this._addressingMode = $state(Addressing.DIRECT)
		this.signal = $state(0 as U16)
		this.instructionRegisterBus = instructionRegisterBus
		this.dataBus = dataBus
		this.aluBus = aluBus
		this.controlBus = controlBus
	}

	/** The currently selected addressing mode */
	get addressingMode(): Addressing {
		return this._addressingMode
	}

	/** Set the vaue of the repeated signal to the value found on the bus selected by the current {@link Addressing}.
	 * @throws {NoSignalError} */
	readSignal(): void {
		switch (this._addressingMode) {
			case Addressing.DIRECT:
				this.signal = this.dataBus.readSignalUnsignedOrThrow()
				break

			case Addressing.IMMEDIATE:
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

	/** Set the value of the current {@link Addressing} to the value found on the bus connected to the control unit.
	 * @throws {NoSignalError}
	 * @throws {InvalidAddressingModeError} */
	readAddressingModeSignal(): void {
		const mode = this.controlBus.readSignalUnsignedOrThrow()
		assertAddressing(mode)
		this._addressingMode = mode
	}
}
