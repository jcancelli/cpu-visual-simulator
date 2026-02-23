import {
	BusID,
	Register,
	type ReadSignalBusAction,
	type SendSignalBusAction,
} from "$lib/execution/action"
import {
	MEMORY_FETCH_ACTIONS,
	MEMORY_READ_ACTIONS,
	MEMORY_WRITE_ACTIONS,
} from "$lib/execution/actions_presets"
import {
	assertI16,
	assertI8,
	assertU16,
	assertU8,
	i16LSB,
	i16MSB,
	isValidU8,
	joinU8ToI16,
	joinU8ToU16,
	u16LSB,
	u16MSB,
	u8,
	type I16,
	type U16,
	type U8,
} from "$lib/integer"
import { todo, unreachable } from "$lib/util/development"
import {
	ActionHandlerMap,
	type ActionConsumer,
	type ActionHandlerResult,
} from "$lib/execution/action_performer"
import { ActionType, Task } from "$lib/execution/task"
import type { Bus } from "./bus.svelte"

/** A value that is a valid memory address */
export type Address = U8
/** An {@link Address} with a specific alignment */
export type AlignedAddress<Alignment extends number> = Address & { __alignment: Alignment }
/** A byte (8-bit) aligned {@link Address} */
export type ByteAlignedAddress = AlignedAddress<1>
/** A word (16-bit) aligned {@link Address} */
export type WordAlignedAddress = AlignedAddress<2>

/** The lowest valid address */
export const MIN_ADDRESS = 0
/** The highest valid address for a byte */
export const MAX_ADDRESS = 255
/** The highest valid address for a word */
export const MAX_WORD_ADDRESS = 254
/** Size of a word in bytes */
export const WORD_ALIGNMENT = 2
/** Size in bytes of the memory */
export const MEMORY_SIZE_BYTES = 256
/** Size in words of the memory */
export const MEMORY_SIZE_WORDS = MEMORY_SIZE_BYTES / WORD_ALIGNMENT

/** Check if the provided value is in the valid memory address range */
export function isInAddressRange(address: number): address is Address {
	return isValidU8(address)
}

/** Check if the provided value is a valid, byte-aligned address */
export function isByteAlignedAddress(address: number): address is ByteAlignedAddress {
	return isInAddressRange(address)
}

/** Check if the provided value is a valid, word-aligned address */
export function isWordAlignedAddress(address: number): address is WordAlignedAddress {
	return isInAddressRange(address) && (address & 1) === 0
}

/** Asserts that the provided value is in the valid memory address range.
 * @throws {AddressOutOfRangeError} */
export function assertAddressInRange(address: number): asserts address is Address {
	if (!isInAddressRange(address)) {
		throw new AddressOutOfRangeError(address)
	}
}

/** Asserts that the provided value is a valid, byte-aligned address.
 * @throws {AddressOutOfRangeError}
 * @throws {InvalidByteAlignedAddressError} */
export function assertByteAlignedAddress(address: number): asserts address is ByteAlignedAddress {
	assertAddressInRange(address)
	if (!isByteAlignedAddress(address)) {
		throw new InvalidByteAlignedAddressError(address)
	}
}

/** Asserts that the provided value is a valid, word-aligned address.
 * @throws {AddressOutOfRangeError}
 * @throws {InvalidWordAlignedAddressError} */
export function assertWordAlignedAddress(address: number): asserts address is WordAlignedAddress {
	assertAddressInRange(address)
	if (!isWordAlignedAddress(address)) {
		throw new InvalidWordAlignedAddressError(address)
	}
}

/** Operation that can be signaled to the memory on the control bus */
export enum MemoryOperation {
	READ = 0b1,
	WRITE = 0b10,
	FETCH = 0b100,
}

/** Check if the specified value is a valid {@link MemoryOperation} */
export function isMemoryOperation(value: number): value is MemoryOperation {
	return value === MemoryOperation.READ || value === MemoryOperation.WRITE
}

/** Assert that the specified value is a valid {@link MemoryOperation}
 * @throws {InvalidMemoryOperationError}*/
export function assertMemoryOperation(value: number): asserts value is MemoryOperation {
	if (!isMemoryOperation(value)) {
		throw new InvalidMemoryOperationError(value)
	}
}

/** Action types handled by the {@link Memory} */
export type MemoryHandledActions =
	| ActionType.SEND_SIGNAL
	| ActionType.READ_SIGNAL
	| ActionType.PERFORM_MEMORY_OPERATION

/** State of the memory */
export default class Memory implements ActionConsumer<MemoryHandledActions> {
	/** Writable state containing the memory's contents. */
	private _bytes: U8[]
	/** The currently selected address */
	private _selectedAddress: WordAlignedAddress
	/** The current memory operation */
	private _selectedOperation: MemoryOperation
	/** Reference to the data bus */
	private dataBus: Bus<16>
	/** Reference to the address bus */
	private addressBus: Bus<8>
	/** Reference to the control bus */
	private controlBus: Bus<8>

	public readonly actionHandlers: ActionHandlerMap<MemoryHandledActions>

	constructor(dataBus: Bus<16>, addressBus: Bus<8>, controlBus: Bus<8>) {
		this._bytes = $state(new Array(MEMORY_SIZE_BYTES).fill(0))
		this._selectedAddress = $state(0 as WordAlignedAddress)
		this._selectedOperation = $state(MemoryOperation.READ)
		this.dataBus = dataBus
		this.addressBus = addressBus
		this.controlBus = controlBus
		this.actionHandlers = new ActionHandlerMap({
			[ActionType.SEND_SIGNAL]: this.handleSendSignalBusAction.bind(this),
			[ActionType.READ_SIGNAL]: this.handleReadSignalBusAction.bind(this),
			[ActionType.PERFORM_MEMORY_OPERATION]:
				this.handlePerformMemoryOperationAction.bind(this),
		})
	}

	/** Readonly state containing the memory's contents */
	get bytes(): ReadonlyArray<U8> {
		return this._bytes
	}

	/** The currently selected address */
	get selectedAddress(): WordAlignedAddress {
		return this._selectedAddress
	}

	/** The current memory operation */
	get selectedOperation(): MemoryOperation {
		return this._selectedOperation
	}

	/** Set all bytes to 0 */
	clear(): void {
		for (let address = MIN_ADDRESS; address <= MAX_ADDRESS; address += 1) {
			this._bytes[address] = 0 as U8
		}
	}

	/** Write the specified 8-bit unsigned integer at the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidByteAlignedAddressError}
	 * @throws {InvalidU8Error} */
	writeU8(address: number, value: number): void {
		assertByteAlignedAddress(address)
		assertU8(value)
		this._bytes[address] = value
	}

	/** Write the specified 8-bit signed integer at the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidByteAlignedAddressError}
	 * @throws {InvalidI8Error} */
	writeI8(address: number, value: number): void {
		assertByteAlignedAddress(address)
		assertI8(value)
		this._bytes[address] = u8(value)
	}

	/** Write the specified 16-bit unsigned integer at the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError}
	 * @throws {InvalidU16Error} */
	writeU16(address: number, value: number): void {
		assertWordAlignedAddress(address)
		assertU16(value)
		this._bytes[address] = u16MSB(value)
		this._bytes[address + 1] = u16LSB(value)
	}

	/** Write the specified 16-bit signed integer at the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError}
	 * @throws {InvalidI16Error} */
	writeI16(address: number, value: number): void {
		assertWordAlignedAddress(address)
		assertI16(value)
		this._bytes[address] = i16MSB(value)
		this._bytes[address + 1] = i16LSB(value)
	}

	/** Read a 16-bit unsigned integer from the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	readU16(address: number): U16 {
		assertWordAlignedAddress(address)
		return joinU8ToU16(this._bytes[address], this._bytes[address + 1])
	}

	/** Read a 16-bit signed integer from the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	readI16(address: number): I16 {
		assertWordAlignedAddress(address)
		return joinU8ToI16(this._bytes[address], this._bytes[address + 1])
	}

	/** Shift down by {@link WORD_ALIGNMENT} all bytes from {@link MIN_ADDRESS} to {@link msbAddress} + 1.
	 * {@link msbAddress} + {@link WORD_ALIGNMENT} and {@link msbAddress} + {@link WORD_ALIGNMENT} + 1 are overwritten.
	 * {@link MIN_ADDRESS} and {@link MIN_ADDRESS} + 1 are set to 0.
	 * If {@link msbAddress} === {@link MAX_WORD_ADDRESS}, the shift is not performed.
	 * Note: "upperHalf" refers to all the addresses <= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfDownFromAddress(msbAddress: number): void {
		if (msbAddress === MAX_WORD_ADDRESS) {
			// Noop if it's trying to shift from the last address
			return
		}
		assertWordAlignedAddress(msbAddress)
		const lowerMsbAddress = msbAddress + WORD_ALIGNMENT
		const lowerLsbAddress = lowerMsbAddress + 1
		const upperMsbAddress = MIN_ADDRESS
		const upperLsbAddress = upperMsbAddress + 1
		for (let newAddress = lowerLsbAddress; newAddress > upperLsbAddress; newAddress -= 1) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[upperMsbAddress] = 0 as U8
		this._bytes[upperLsbAddress] = 0 as U8
	}

	/** Shift down by {@link WORD_ALIGNMENT} all bytes from {@link msbAddress} to {@link MAX_WORD_ADDRESS} - 1.
	 * {@link MAX_WORD_ADDRESS} and {@link MAX_WORD_ADDRESS} + 1 are overwritten.
	 * {@link msbAddress} and {@link msbAddress} + 1 are set to 0.
	 * Note: "lowerHalf" refers to all the addresses >= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfDownFromAddress(msbAddress: number): void {
		assertWordAlignedAddress(msbAddress)
		const lowerMsbAddress = MAX_WORD_ADDRESS
		const lowerLsbAddress = lowerMsbAddress + 1
		const upperMsbAddress = msbAddress
		const upperLsbAddress = upperMsbAddress + 1
		for (let newAddress = lowerLsbAddress; newAddress > upperLsbAddress; newAddress -= 1) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[upperMsbAddress] = 0 as U8
		this._bytes[upperLsbAddress] = 0 as U8
	}

	/** Shift up by {@link WORD_ALIGNMENT} all bytes from {@link MIN_ADDRESS} + {@link WORD_ALIGNMENT} to {@link msbAddress} + 1.
	 * {@link MIN_ADDRESS} and {@link MIN_ADDRESS} + 1 are overwritten.
	 * {@link msbAddress} and {@link msbAddress} + 1 are set to 0.
	 * Note: "upperHalf" refers to all the addresses <= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfUpFromAddress(msbAddress: number): void {
		assertWordAlignedAddress(msbAddress)
		const upperMsbAddress = MIN_ADDRESS
		const lowerMsbAddress = msbAddress
		const lowerLsbAddress = lowerMsbAddress + 1
		for (let newAddress = upperMsbAddress; newAddress < lowerMsbAddress; newAddress += 1) {
			const oldAddress = newAddress + WORD_ALIGNMENT
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[lowerMsbAddress] = 0 as U8
		this._bytes[lowerLsbAddress] = 0 as U8
	}

	/** Shift up by {@link WORD_ALIGNMENT} all bytes from {@link msbAddress} to {@link MAX_ADDRESS}.
	 * {@link msbAddress} - {@link WORD_ALIGNMENT} and {@link msbAddress} - 1 are overwritten.
	 * {@link MAX_WORD_ADDRESS} and {@link MAX_WORD_ADDRESS} + 1 are set to 0.
	 * If {@link msbAddress} === {@link MIN_ADDRESS}, the shift is not performed.
	 * Note: "lowerHalf" refers to all the addresses >= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfUpFromAddress(msbAddress: number): void {
		if (msbAddress === MIN_ADDRESS) {
			// Noop if it's trying to shift from the first address
			return
		}
		assertWordAlignedAddress(msbAddress)
		const upperMsbAddress = msbAddress - WORD_ALIGNMENT
		const lowerMsbAddress = MAX_WORD_ADDRESS
		const lowerLsbAddress = lowerMsbAddress + 1
		for (let newAddress = upperMsbAddress; newAddress < lowerMsbAddress; newAddress += 1) {
			const oldAddress = newAddress + WORD_ALIGNMENT
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[lowerMsbAddress] = 0 as U8
		this._bytes[lowerLsbAddress] = 0 as U8
	}

	/** {@link ActionHandler} for {@link SendSignalBusAction} */
	private async handleSendSignalBusAction(
		action: SendSignalBusAction,
	): Promise<ActionHandlerResult> {
		if (action.from !== Register.MEMORY || action.bus !== BusID.DATA) {
			unreachable()
		}
		const data = this.readU16(this.selectedAddress)
		this.dataBus.sendSignalUnsigned(data)
		return { actionWasHandled: true }
	}

	/** {@link ActionHandler} for {@link ReadSignalBusAction} */
	private async handleReadSignalBusAction(
		action: ReadSignalBusAction,
	): Promise<ActionHandlerResult> {
		todo(action.toString())
	}

	/** {@link ActionHandler} for {@link PerformMemoryOperationAction} */
	private async handlePerformMemoryOperationAction(): Promise<ActionHandlerResult> {
		const newTasks: Task[] = []
		switch (this._selectedOperation) {
			case MemoryOperation.READ:
				newTasks.push(...MEMORY_READ_ACTIONS)
				break

			case MemoryOperation.WRITE:
				newTasks.push(...MEMORY_WRITE_ACTIONS)
				break

			case MemoryOperation.FETCH:
				newTasks.push(...MEMORY_FETCH_ACTIONS)
				break

			default:
				unreachable()
		}
		todo()
	}
}

/** Base class for an error regarding memory. */
export abstract class MemoryError extends Error {}

/** Base class for errors regarding a memory address. */
export abstract class AddressError extends MemoryError {
	/** The address that caused the error. */
	public readonly address: number

	constructor(address: number, message: string) {
		super(message)
		this.address = address
	}
}

/** Error regarding an address that is not in the valid memory address range. */
export class AddressOutOfRangeError extends AddressError {
	constructor(address: number) {
		super(address, `Address out of range: ${address}`)
	}
}

/** Error regarding an address that doesn't match a given alignment. */
export abstract class MisalignedAddressError extends AddressError {
	/** The required alignment */
	public readonly alignment: number

	constructor(address: number, alignment: number) {
		super(address, `Address: ${address}, Alignment: ${alignment}`)
		this.alignment = alignment
	}
}

/** Error regarding an address that is not byte-aligned. */
export class InvalidByteAlignedAddressError extends MisalignedAddressError {
	constructor(address: number) {
		super(address, 1)
	}
}

/** Error regarding an address that is not word-aligned. */
export class InvalidWordAlignedAddressError extends MisalignedAddressError {
	constructor(address: number) {
		super(address, 2)
	}
}

/** Error regarding an unexpected value presented as memory operation. */
export class InvalidMemoryOperationError extends MemoryError {
	public readonly value: number

	constructor(value: number) {
		super(`Invalid memory operation value: ${value.toString(2)}`)
		this.value = value
	}
}
