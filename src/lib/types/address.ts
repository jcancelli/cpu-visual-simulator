import {
	AddressOutOfRangeError,
	InvalidByteAlignedAddressError,
	InvalidWordAlignedAddressError,
} from "$lib/errors/address"
import { isValidU8, type U8 } from "./integer"

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
export function isAddress(address: number): address is Address {
	return isValidU8(address)
}

/** Check if the provided value is a valid, byte-aligned address */
export function isByteAlignedAddress(address: number): address is ByteAlignedAddress {
	return isAddress(address)
}

/** Check if the provided value is a valid, word-aligned address */
export function isWordAlignedAddress(address: number): address is WordAlignedAddress {
	return isAddress(address) && (address & 1) === 0
}

/** Asserts that the provided value is in the valid memory address range.
 * @throws {AddressOutOfRangeError} */
export function assertAddress(address: number): asserts address is Address {
	if (!isAddress(address)) {
		throw new AddressOutOfRangeError(address)
	}
}

/** Asserts that the provided value is a valid, byte-aligned address.
 * @throws {AddressOutOfRangeError}
 * @throws {InvalidByteAlignedAddressError} */
export function assertByteAlignedAddress(address: number): asserts address is ByteAlignedAddress {
	assertAddress(address)
	if (!isByteAlignedAddress(address)) {
		throw new InvalidByteAlignedAddressError(address)
	}
}

/** Asserts that the provided value is a valid, word-aligned address.
 * @throws {AddressOutOfRangeError}
 * @throws {InvalidWordAlignedAddressError} */
export function assertWordAlignedAddress(address: number): asserts address is WordAlignedAddress {
	assertAddress(address)
	if (!isWordAlignedAddress(address)) {
		throw new InvalidWordAlignedAddressError(address)
	}
}
