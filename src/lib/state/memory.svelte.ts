import {
	assertI16,
	assertU16,
	i16LSB,
	i16MSB,
	joinU8ToI16,
	joinU8ToU16,
	u16LSB,
	u16MSB,
	type I16,
	type U16,
	type U8,
} from "$lib/types/integer"
import {
	assertWordAlignedAddress,
	LAST_BYTE_ADDRESS,
	LAST_WORD_ADDRESS,
	MEMORY_SIZE_BYTES,
	FIRST_ADDRESS,
	WORD_ALIGNMENT,
} from "$lib/types/address"
import type { WordAddressRegister } from "$lib/register/word_address"
import type { MemoryOperationRegister } from "$lib/register/memory_operation"
import { ByteRegisterImpl, type ByteRegister } from "$lib/register/register.svelte"

/** State of the memory */
export default class Memory {
	/** List of bytes representing this memory data */
	public readonly data: ReadonlyArray<ByteRegister>
	/** The currently selected address */
	public readonly selectedAddress: WordAddressRegister
	/** The currently selected memory operation */
	public readonly selectedOperation: MemoryOperationRegister

	constructor(
		selectedAddressRegister: WordAddressRegister,
		selectedOperationRegister: MemoryOperationRegister,
	) {
		this.data = Array(MEMORY_SIZE_BYTES)
			.fill(0)
			.map(() => new ByteRegisterImpl())
		this.selectedAddress = selectedAddressRegister
		this.selectedOperation = selectedOperationRegister
	}

	/** Set all bytes to 0 */
	clear(): void {
		for (let address = FIRST_ADDRESS; address <= LAST_BYTE_ADDRESS; address += 1) {
			this.data[address].unsigned = 0 as U8
		}
	}

	/** Write the specified 16-bit unsigned integer at the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError}
	 * @throws {InvalidU16Error} */
	writeU16(address: number, value: number): void {
		assertWordAlignedAddress(address)
		assertU16(value)
		this.data[address].unsigned = u16MSB(value)
		this.data[address + 1].unsigned = u16LSB(value)
	}

	/** Write the specified 16-bit signed integer at the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError}
	 * @throws {InvalidI16Error} */
	writeI16(address: number, value: number): void {
		assertWordAlignedAddress(address)
		assertI16(value)
		this.data[address].unsigned = i16MSB(value)
		this.data[address + 1].unsigned = i16LSB(value)
	}

	/** Read a 16-bit unsigned integer from the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	readU16(address: number): U16 {
		assertWordAlignedAddress(address)
		return joinU8ToU16(this.data[address].unsigned, this.data[address + 1].unsigned)
	}

	/** Read a 16-bit signed integer from the specified address.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	readI16(address: number): I16 {
		assertWordAlignedAddress(address)
		return joinU8ToI16(this.data[address].unsigned, this.data[address + 1].unsigned)
	}

	/** Shift down by {@link WORD_ALIGNMENT} all bytes from {@link FIRST_ADDRESS} to {@link msbAddress} + 1.
	 * {@link msbAddress} + {@link WORD_ALIGNMENT} and {@link msbAddress} + {@link WORD_ALIGNMENT} + 1 are overwritten.
	 * {@link FIRST_ADDRESS} and {@link FIRST_ADDRESS} + 1 are set to 0.
	 * If {@link msbAddress} === {@link LAST_WORD_ADDRESS}, the shift is not performed.
	 * Note: "upperHalf" refers to all the addresses <= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfDownFromAddress(msbAddress: number): void {
		if (msbAddress === LAST_WORD_ADDRESS) {
			// Noop if it's trying to shift from the last address
			return
		}
		assertWordAlignedAddress(msbAddress)
		const lowerMsbAddress = msbAddress + WORD_ALIGNMENT
		const lowerLsbAddress = lowerMsbAddress + 1
		const upperMsbAddress = FIRST_ADDRESS
		const upperLsbAddress = upperMsbAddress + 1
		for (let newAddress = lowerLsbAddress; newAddress > upperLsbAddress; newAddress -= 1) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this.data[newAddress].unsigned = this.data[oldAddress].unsigned
		}
		this.data[upperMsbAddress].unsigned = 0 as U8
		this.data[upperLsbAddress].unsigned = 0 as U8
	}

	/** Shift down by {@link WORD_ALIGNMENT} all bytes from {@link msbAddress} to {@link LAST_WORD_ADDRESS} - 1.
	 * {@link LAST_WORD_ADDRESS} and {@link LAST_WORD_ADDRESS} + 1 are overwritten.
	 * {@link msbAddress} and {@link msbAddress} + 1 are set to 0.
	 * Note: "lowerHalf" refers to all the addresses >= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfDownFromAddress(msbAddress: number): void {
		assertWordAlignedAddress(msbAddress)
		const lowerMsbAddress = LAST_WORD_ADDRESS
		const lowerLsbAddress = lowerMsbAddress + 1
		const upperMsbAddress = msbAddress
		const upperLsbAddress = upperMsbAddress + 1
		for (let newAddress = lowerLsbAddress; newAddress > upperLsbAddress; newAddress -= 1) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this.data[newAddress].unsigned = this.data[oldAddress].unsigned
		}
		this.data[upperMsbAddress].unsigned = 0 as U8
		this.data[upperLsbAddress].unsigned = 0 as U8
	}

	/** Shift up by {@link WORD_ALIGNMENT} all bytes from {@link FIRST_ADDRESS} + {@link WORD_ALIGNMENT} to {@link msbAddress} + 1.
	 * {@link FIRST_ADDRESS} and {@link FIRST_ADDRESS} + 1 are overwritten.
	 * {@link msbAddress} and {@link msbAddress} + 1 are set to 0.
	 * Note: "upperHalf" refers to all the addresses <= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfUpFromAddress(msbAddress: number): void {
		assertWordAlignedAddress(msbAddress)
		const upperMsbAddress = FIRST_ADDRESS
		const lowerMsbAddress = msbAddress
		const lowerLsbAddress = lowerMsbAddress + 1
		for (let newAddress = upperMsbAddress; newAddress < lowerMsbAddress; newAddress += 1) {
			const oldAddress = newAddress + WORD_ALIGNMENT
			this.data[newAddress].unsigned = this.data[oldAddress].unsigned
		}
		this.data[lowerMsbAddress].unsigned = 0 as U8
		this.data[lowerLsbAddress].unsigned = 0 as U8
	}

	/** Shift up by {@link WORD_ALIGNMENT} all bytes from {@link msbAddress} to {@link LAST_BYTE_ADDRESS}.
	 * {@link msbAddress} - {@link WORD_ALIGNMENT} and {@link msbAddress} - 1 are overwritten.
	 * {@link LAST_WORD_ADDRESS} and {@link LAST_WORD_ADDRESS} + 1 are set to 0.
	 * If {@link msbAddress} === {@link FIRST_ADDRESS}, the shift is not performed.
	 * Note: "lowerHalf" refers to all the addresses >= {@link msbAddress}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfUpFromAddress(msbAddress: number): void {
		if (msbAddress === FIRST_ADDRESS) {
			// Noop if it's trying to shift from the first address
			return
		}
		assertWordAlignedAddress(msbAddress)
		const upperMsbAddress = msbAddress - WORD_ALIGNMENT
		const lowerMsbAddress = LAST_WORD_ADDRESS
		const lowerLsbAddress = lowerMsbAddress + 1
		for (let newAddress = upperMsbAddress; newAddress < lowerMsbAddress; newAddress += 1) {
			const oldAddress = newAddress + WORD_ALIGNMENT
			this.data[newAddress].unsigned = this.data[oldAddress].unsigned
		}
		this.data[lowerMsbAddress].unsigned = 0 as U8
		this.data[lowerLsbAddress].unsigned = 0 as U8
	}
}
