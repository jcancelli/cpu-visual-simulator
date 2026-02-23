export const I8_MIN = -128
export const I8_MAX = 127
export const U8_MIN = 0
export const U8_MAX = 255
export const I16_MIN = -32_768
export const I16_MAX = 32_767
export const U16_MIN = 0
export const U16_MAX = 65_535

/** Type brand representing signedness of an integer type */
export type Signed = { __signed: true }
/** Type brand representing unsignedness of an integer type */
export type Unsigned = { __signed: false }
/** Type brand representing the size in bits of an integer type */
export type Sized<Bits extends number> = { __bits: Bits }
/** A signed integer of a specific size in bits */
export type Int<Bits extends number> = number & Signed & Sized<Bits>
/** An unsigned integer of a specific size in bits */
export type UInt<Bits extends number> = number & Unsigned & Sized<Bits>
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

/** Base class for errors regarding numeric values out of a specific n-bits signed/unsigned range */
export abstract class IntegerOutOfRangeError extends Error {
	constructor(bits: 8 | 16, signed: boolean, value: number) {
		super(`value: ${value} out of ${bits}-bit ${signed ? "signed" : "unsigned"} range`)
	}
}

/** Error regarding numeric values out of 8-bit unsigned integer valid range */
export class InvalidU8Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(8, false, value)
	}
}

/** Error regarding numeric values out of 8-bit signed integer valid range */
export class InvalidI8Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(8, true, value)
	}
}

/** Error regarding numeric values out of 16-bit unsigned integer valid range */
export class InvalidU16Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(16, false, value)
	}
}

/** Error regarding numeric values out of 16-bit signed integer valid range */
export class InvalidI16Error extends IntegerOutOfRangeError {
	constructor(value: number) {
		super(16, true, value)
	}
}
