import type { Bus } from "./bus.svelte"
import { assertI8, assertU8, i8, u8, type I8, type U8 } from "$lib/types/integer"
import {
	assertWordAlignedAddress,
	MAX_WORD_ADDRESS,
	type WordAlignedAddress,
} from "$lib/types/address"
import type { IncrementProgramCounterAction } from "$lib/execution/actions/cpu"
import type { SubmitTasksFunction } from "$lib/execution/action_handler"
import {
	INCREMENT_PROGRAM_COUNTER_ACTIONS,
	MAX_ADDRESS_REACHED_ACTIONS,
} from "$lib/execution/steps_actions"

/** State of the program counter */
export class ProgramCounter {
	private _address: WordAlignedAddress
	private addressBus: Bus<8>

	constructor(addressBus: Bus<8>) {
		this._address = $state(0 as WordAlignedAddress)
		this.addressBus = addressBus
	}

	get address(): WordAlignedAddress {
		return this._address
	}

	/** @throws {AddressOutOfRangeError}
	 * @throwns {InvalidWordAlignedAddressError} */
	set address(address: WordAlignedAddress) {
		assertWordAlignedAddress(address)
		this._address = address
	}

	get unsigned(): U8 {
		return this._address as U8
	}

	/** @throws {InvalidU8Error}
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	set unsigned(value: U8) {
		assertU8(value)
		assertWordAlignedAddress(value)
		this._address = value
	}

	get signed(): I8 {
		return i8(this._address)
	}

	/** @throws {InvalidI8Error}
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	set signed(value: I8) {
		assertI8(value)
		const unsigned = u8(value)
		assertWordAlignedAddress(unsigned)
		this._address = unsigned
	}

	/** Set the program counter value to the value found on the address bus.
	 * @throws {NoSignalError}
	 *  @throws {AddressOutOfRangeError}
	 *  @throws {InvalidWordAlignedAddressError} */
	readAddressSignal(): void {
		const signal = this.addressBus.readSignalUnsignedOrThrow()
		assertWordAlignedAddress(signal)
		this._address = signal
	}

	/** Send the value of the opcode on the address bus */
	sendAddressSignal(): void {
		this.addressBus.sendSignalUnsigned(this._address)
	}

	/** {@link ActionHandler} for {@link IncrementProgramCounterAction} */
	handleIncrementProgramCounterAction(
		_: IncrementProgramCounterAction,
		submitTasks: SubmitTasksFunction,
	): boolean {
		if (this._address === MAX_WORD_ADDRESS) {
			submitTasks(...MAX_ADDRESS_REACHED_ACTIONS)
		} else {
			submitTasks(...INCREMENT_PROGRAM_COUNTER_ACTIONS)
		}
		return true
	}
}
