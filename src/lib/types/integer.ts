import {
	InvalidI16Error,
	InvalidI8Error,
	InvalidU16Error,
	InvalidU8Error,
} from "$lib/errors/integer"

export const I8_MIN = -128
export const I8_MAX = 127
export const U8_MIN = 0
export const U8_MAX = 255
export const I16_MIN = -32_768
export const I16_MAX = 32_767
export const U16_MIN = 0
export const U16_MAX = 65_535

/** Base of an integer string representation */
export enum Base {
	/** Base 2 */
	BINARY = 2,
	/** Base 10 */
	DECIMAL = 10,
	/** Base 16 */
	HEX = 16,
}

/** Type brand representing signedness of an integer type */
export type Signed = { __signed: true }
/** Type brand representing unsignedness of an integer type */
export type Unsigned = { __signed: false }
/** Type brand representing the size in bits of an integer type */
export type Sized<Bits extends number> = { __bits: Bits }
/** A signed or unsigned integer of {@link Bits} size */
export type SizedInt<Bits extends number> = number & Sized<Bits>
/** An 8-bit signed or unsigned integer */
export type Byte = SizedInt<8>
/** A 16-bit signed or unsigned integer */
export type Word = SizedInt<16>
/** A signed integer of a specific size in bits */
export type Int<Bits extends number> = SizedInt<Bits> & Signed
/** An unsigned integer of a specific size in bits */
export type UInt<Bits extends number> = SizedInt<Bits> & Unsigned
/** 8-bit signed integer */
export type I8 = Int<8>
/** 8-bit unsigned integer */
export type U8 = UInt<8>
/** 16-bit signed integer */
export type I16 = Int<16>
/** 16-bit unsigned integer */
export type U16 = UInt<16>

/** Check that the provided value is in the 8-bit signed range */
export function isValidI8(value: number): value is I8 {
	return value >= I8_MIN && value <= I8_MAX
}

/** Check that the provided value is in the 8-bit unsigned range */
export function isValidU8(value: number): value is U8 {
	return value >= U8_MIN && value <= U8_MAX
}

/** Check that the provided value is in the 16-bit signed range */
export function isValidI16(value: number): value is I16 {
	return value >= I16_MIN && value <= I16_MAX
}

/** Check that the provided value is in the 16-bit unsigned range */
export function isValidU16(value: number): value is U16 {
	return value >= U16_MIN && value <= U16_MAX
}

/** Asserts that {@link value} is a valid {@link I8}.
 * @throws {InvalidI8Error} */
export function assertI8(value: number): asserts value is I8 {
	if (!isValidI8(value)) {
		throw new InvalidI8Error(value)
	}
}

/** Asserts that {@link value} is a valid {@link U8}.
 * @throws {InvalidU8Error} */
export function assertU8(value: number): asserts value is U8 {
	if (!isValidU8(value)) {
		throw new InvalidU8Error(value)
	}
}

/** Asserts that {@link value} is a valid {@link I16}.
 * @throws {InvalidI16Error} */
export function assertI16(value: number): asserts value is I16 {
	if (!isValidI16(value)) {
		throw new InvalidI16Error(value)
	}
}

/** Asserts that {@link value} is a valid {@link U16}.
 * @throws {InvalidU16Error} */
export function assertU16(value: number): asserts value is U16 {
	if (!isValidU16(value)) {
		throw new InvalidU16Error(value)
	}
}

/** Cast an unsigned integer to an 8-bit signed integer.
 * Only the least significant byte of the input is considered.
 * @param unsignedValue An unsigned number of any size
 * @returns The least significant byte of the input casted into a signed integer */
export function i8(unsignedValue: number): I8 {
	return (((unsignedValue & 0xff) << 24) >> 24) as I8
}

/** Cast a signed integer to an 8-bit unsigned integer.
 * Only the least significant byte of the input is considered.
 * @param signedValue A signed number of any size
 * @returns The least significant byte of the input casted into an unsigned integer */
export function u8(signedValue: number): U8 {
	return (signedValue & 0xff) as U8
}

/** Cast an unsigned integer to a 16-bit signed integer.
 * Only the 2 least significant bytes of the input are considered.
 * @param unsignedValue An unsigned number of any size
 * @returns The 2 least significant bytes of the input casted into a signed integer */
export function i16(unsignedValue: number): I16 {
	return (((unsignedValue & 0xffff) << 16) >> 16) as I16
}

/** Cast a signed integer to a 16-bit unsigned integer.
 * Only the 2 least significant bytes of the input are considered.
 * @param signedValue A signed number of any size
 * @returns The 2 least significant bytes of the input casted into an unsigned integer */
export function u16(signedValue: number): U16 {
	return (signedValue & 0xffff) as U16
}

/** Return the most significant byte of a 16-bit signed integer.
 * @param signedValue A signed number of any size
 * @returns The 2nd least significant byte as an unsigned 8-bit integer */
export function i16MSB(signedValue: I16): U8 {
	return ((signedValue & 0xff00) >>> 8) as U8
}

/** Return the least significant byte of a 16-bit signed integer.
 * @param signedValue A signed number of any size
 * @returns The least significant byte as an unsigned 8-bit integer */
export function i16LSB(signedValue: I16): U8 {
	return (signedValue & 0xff) as U8
}

/** Return the most significant byte of a 16-bit unsigned integer.
 * @param unsignedValue An unsigned number of any size
 * @returns The 2nd least significant byte as an unsigned 8-bit integer */
export function u16MSB(unsignedValue: U16): U8 {
	return (unsignedValue >>> 8) as U8
}

/** Return the least significant byte of a 16-bit unsigned integer.
 * @param unsignedValue An unsigned number of any size
 * @returns The least significant byte as an unsigned 8-bit integer */
export function u16LSB(unsignedValue: U16): U8 {
	return (unsignedValue & 0xff) as U8
}

/** Join 2 8-bit unsigned integers into a 16-bit signed integer.
 * The input bytes are assumed to be valid 8-bit unsigned integers.
 * @param msb The most significant byte (unsigned)
 * @param lsb The least significant byte (unsigned)
 * @returns A 16-bit signed integer */
export function joinU8ToI16(msb: U8, lsb: U8): I16 {
	return ((((msb << 8) | lsb) << 16) >> 16) as I16
}

/** Join 2 8-bit unsigned integers into a 16-bit unsigned integer.
 * The input bytes are assumed to be valid 8-bit unsigned integers.
 * @param msb The most significant byte (unsigned)
 * @param lsb The least significant byte (unsigned)
 * @returns A 16-bit unsigned integer */
export function joinU8ToU16(msb: U8, lsb: U8): U16 {
	return ((msb << 8) | lsb) as U16
}

/** Set the most significant byte of an unsigned 16-bit integer.
 * @param value The 16-bit integer
 * @param msb The new value of the most significant byte
 * @returns The input value with the most significant byte updated */
export function setU16MSB(value: U16, msb: U8): U16 {
	return ((msb << 8) | (value & 0xff)) as U16
}

/** Set the least significant byte of an unsigned 16-bit integer.
 * @param value The 16-bit integer
 * @param lsb The new value of the least significant byte
 * @returns The input value with the least significant byte updated */
export function setU16LSB(value: U16, lsb: U8): U16 {
	return (lsb | (value & 0xff00)) as U16
}

/** Format the provided value into a string padded with leading 0 */
export function u8ToPaddedString(value: U8, base: Base = Base.DECIMAL): string {
	switch (base) {
		case Base.BINARY:
			return value.toString(2).padStart(8, "0")

		case Base.DECIMAL:
			return value.toString(10)

		case Base.HEX:
			return value.toString(16).padStart(2, "0")
	}
}

/** Format the provided value into a string padded with leading 0 */
export function i8ToPaddedString(value: I8, base: Base = Base.DECIMAL): string {
	return u8ToPaddedString(u8(value), base)
}

/** Format the provided value into a string padded with leading 0 */
export function u16ToPaddedString(value: U16, base: Base = Base.DECIMAL): string {
	switch (base) {
		case Base.BINARY:
			return value.toString(2).padStart(16, "0")

		case Base.DECIMAL:
			return value.toString(10)

		case Base.HEX:
			return value.toString(16).padStart(4, "0")
	}
}

/** Format the provided value into a string padded with leading 0 */
export function i16ToPaddedString(value: I16, base: Base = Base.DECIMAL): string {
	return u16ToPaddedString(u16(value), base)
}
