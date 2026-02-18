import {
	assertI16,
	assertI8,
	assertU16,
	assertU8,
	i16MSB,
	isValidU8,
	u16LSB,
	u16MSB,
	u8,
	type I16,
	type U16,
	type U8,
} from "./integer"

/** IDs of both UI and logical components regarding the memory */
export enum MemoryComponent {
	ADDRESS = "ADDRESS",
	CELL = "CELL",
}

/** The lowest valid address */
export const MIN_ADDRESS = 0
/** The highest valid address for a byte */
export const MAX_ADDRESS = 255
/** The highest valid address for a word */
export const MAX_WORD_ADDRESS = 254
/** Size of a word in bytes */
export const WORD_ALIGN = 2
/** Size in bytes of the memory */
export const MEMORY_SIZE_BYTES = 256
/** Size in words of the memory */
export const MEMORY_SIZE_WORDS = MEMORY_SIZE_BYTES / WORD_ALIGN

/** Return wether or not the provided value is a valid address for a byte */
export function isValidByteAddress(address: number): boolean {
	return isValidU8(address)
}

/** Return wether or not the provided value is a valid address for a word */
export function isValidWordAddress(address: number): boolean {
	return isValidU8(address) && (address & 1) === 0
}

/** Shortcut to check if an address can point to a byte.
 * @throws {InvalidByteAddressError} when the address is not a valid byte address */
export function assertByteAddress(address: number): void {
	if (!isValidByteAddress(address)) {
		throw new InvalidByteAddressError(address)
	}
}

/** Shortcut to check if an address can point to a word.
 * @throws {InvalidWordAddressError} when the address is not a valid word address */
export function assertWordAddress(address: number): void {
	if (!isValidWordAddress(address)) {
		throw new InvalidWordAddressError(address)
	}
}

/** State of the memory */
export default class Memory {
	/** Writable state containing the memory's contents. */
	private _bytes: U8[]

	constructor() {
		this._bytes = $state(new Array(MEMORY_SIZE_BYTES).fill(0))
	}

	/** Readonly state containing the memory's contents. */
	get bytes(): ReadonlyArray<U8> {
		return this._bytes
	}

	/** Set all bytes to 0. */
	clear(): void {
		for (let address = MIN_ADDRESS; address <= MAX_ADDRESS; address += 1) {
			this._bytes[address] = 0
		}
	}

	/** Write the specified 8-bit unsigned integer at the specified address.
	 * @throws {InvalidByteAddressError} if the address is not a valid byte address.
	 * @throws {InvalidU8Error} if the value is not a valid 8-bit unsigned integer. */
	writeU8(address: U8, value: U8): void {
		assertByteAddress(address)
		assertU8(value)
		this._bytes[address] = value
	}

	/** Write the specified 8-bit signed integer at the specified address.
	 * @throws {InvalidByteAddressError} if the address is not a valid byte address.
	 * @throws {InvalidI8Error} if the value is not a valid 8-bit signed integer. */
	writeI8(address: U8, value: U8): void {
		assertByteAddress(address)
		assertI8(value)
		this._bytes[address] = u8(value)
	}

	/** Write the specified 16-bit unsigned integer at the specified address.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address.
	 * @throws {InvalidU16Error} if the value is not a valid 16-bit unsigned integer. */
	writeU16(address: U8, value: U16): void {
		assertWordAddress(address)
		assertU16(value)
		const msb = u16MSB(value)
		const lsb = u16LSB(value)
		this._bytes[address] = msb
		this._bytes[address + 1] = lsb
	}

	/** Write the specified 16-bit signed integer at the specified address.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address.
	 * @throws {InvalidI16Error} if the value is not a valid 16-bit signed integer. */
	writeI16(address: U8, value: I16): void {
		assertWordAddress(address)
		assertI16(value)
		const msb = i16MSB(value)
		const lsb = u16LSB(value)
		this._bytes[address] = msb
		this._bytes[address + 1] = lsb
	}

	/** Shift down by {@link WORD_ALIGN} all bytes from {@link MIN_ADDRESS} to {@link msbAddress} + 1.
	 * {@link msbAddress} + {@link WORD_ALIGN} and {@link msbAddress} + {@link WORD_ALIGN} + 1 are overwritten.
	 * {@link MIN_ADDRESS} and {@link MIN_ADDRESS} + 1 are set to 0.
	 * If {@link msbAddress} === {@link MAX_WORD_ADDRESS}, the shift is not performed.
	 * Note: "upperHalf" refers to all the addresses <= {@link msbAddress}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftUpperHalfDownFromAddress(msbAddress: U8): void {
		if (msbAddress === MAX_WORD_ADDRESS) {
			// Noop if it's trying to shift from the last address
			return
		}
		assertWordAddress(msbAddress)
		const lowerMsbAddress = msbAddress + WORD_ALIGN
		const lowerLsbAddress = lowerMsbAddress + 1
		const upperMsbAddress = MIN_ADDRESS
		const upperLsbAddress = upperMsbAddress + 1
		for (let newAddress = lowerLsbAddress; newAddress > upperLsbAddress; newAddress -= 1) {
			const oldAddress = newAddress - WORD_ALIGN
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[upperMsbAddress] = 0
		this._bytes[upperLsbAddress] = 0
	}

	/** Shift down by {@link WORD_ALIGN} all bytes from {@link msbAddress} to {@link MAX_WORD_ADDRESS} - 1.
	 * {@link MAX_WORD_ADDRESS} and {@link MAX_WORD_ADDRESS} + 1 are overwritten.
	 * {@link msbAddress} and {@link msbAddress} + 1 are set to 0.
	 * Note: "lowerHalf" refers to all the addresses >= {@link msbAddress}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftLowerHalfDownFromAddress(msbAddress: U8): void {
		assertWordAddress(msbAddress)
		const lowerMsbAddress = MAX_WORD_ADDRESS
		const lowerLsbAddress = lowerMsbAddress + 1
		const upperMsbAddress = msbAddress
		const upperLsbAddress = upperMsbAddress + 1
		for (let newAddress = lowerLsbAddress; newAddress > upperLsbAddress; newAddress -= 1) {
			const oldAddress = newAddress - WORD_ALIGN
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[upperMsbAddress] = 0
		this._bytes[upperLsbAddress] = 0
	}

	/** Shift up by {@link WORD_ALIGN} all bytes from {@link MIN_ADDRESS} + {@link WORD_ALIGN} to {@link msbAddress} + 1.
	 * {@link MIN_ADDRESS} and {@link MIN_ADDRESS} + 1 are overwritten.
	 * {@link msbAddress} and {@link msbAddress} + 1 are set to 0.
	 * Note: "upperHalf" refers to all the addresses <= {@link msbAddress}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftUpperHalfUpFromAddress(msbAddress: U8): void {
		assertWordAddress(msbAddress)
		const upperMsbAddress = MIN_ADDRESS
		const lowerMsbAddress = msbAddress
		const lowerLsbAddress = lowerMsbAddress + 1
		for (let newAddress = upperMsbAddress; newAddress < lowerMsbAddress; newAddress += 1) {
			const oldAddress = newAddress + WORD_ALIGN
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[lowerMsbAddress] = 0
		this._bytes[lowerLsbAddress] = 0
	}

	/** Shift up by {@link WORD_ALIGN} all bytes from {@link msbAddress} to {@link MAX_ADDRESS}.
	 * {@link msbAddress} - {@link WORD_ALIGN} and {@link msbAddress} - 1 are overwritten.
	 * {@link MAX_WORD_ADDRESS} and {@link MAX_WORD_ADDRESS} + 1 are set to 0.
	 * If {@link msbAddress} === {@link MIN_ADDRESS}, the shift is not performed.
	 * Note: "lowerHalf" refers to all the addresses >= {@link msbAddress}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftLowerHalfUpFromAddress(msbAddress: U8): void {
		if (msbAddress === MIN_ADDRESS) {
			// Noop if it's trying to shift from the first address
			return
		}
		assertWordAddress(msbAddress)
		const upperMsbAddress = msbAddress - WORD_ALIGN
		const lowerMsbAddress = MAX_WORD_ADDRESS
		const lowerLsbAddress = lowerMsbAddress + 1
		for (let newAddress = upperMsbAddress; newAddress < lowerMsbAddress; newAddress += 1) {
			const oldAddress = newAddress + WORD_ALIGN
			this._bytes[newAddress] = this._bytes[oldAddress]
		}
		this._bytes[lowerMsbAddress] = 0
		this._bytes[lowerLsbAddress] = 0
	}
}

/** Base class for errors regarding an invalid address */
export abstract class InvalidAddressError extends Error {
	/** The address that caused the error. */
	public readonly address: number

	constructor(address: number, message: string) {
		super(message)
		this.address = address
	}
}

/** Error regarding an address that cannot point to a byte */
export class InvalidByteAddressError extends InvalidAddressError {
	constructor(address: number) {
		super(address, `Invalid byte address: ${address}`)
	}
}

/** Error regarding an address that cannot point to a word (16-bit value) */
export class InvalidWordAddressError extends InvalidAddressError {
	constructor(address: number) {
		super(address, `Invalid word address: ${address}`)
	}
}
