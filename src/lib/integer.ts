export const I8_MIN = -128
export const I8_MAX = 127
export const U8_MIN = 0
export const U8_MAX = 255
export const I16_MIN = -32_768
export const I16_MAX = 32_767
export const U16_MIN = 0
export const U16_MAX = 65_535

/** Check that the provided value is in the 8-bit signed range */
export function isValidI8(value: number): boolean {
	return value >= I8_MIN && value <= I8_MAX
}

/** Check that the provided value is in the 8-bit unsigned range */
export function isValidU8(value: number): boolean {
	return value >= U8_MIN && value <= U8_MAX
}

/** Check that the provided value is in the 16-bit signed range */
export function isValidI16(value: number): boolean {
	return value >= I16_MIN && value <= I16_MAX
}

/** Check that the provided value is in the 16-bit unsigned range */
export function isValidU16(value: number): boolean {
	return value >= U16_MIN && value <= U16_MAX
}

/** Shortcut for checking if the input is a valid 8-bit signed integer or throw error */
export function checkI8Throw(value: number): void {
	if (!isValidI8(value)) {
		throw new InvalidI8Error(value)
	}
}

/** Shortcut for checking if the input is a valid 8-bit unsigned integer or throw error */
export function checkU8Throw(value: number): void {
	if (!isValidU8(value)) {
		throw new InvalidU8Error(value)
	}
}

/** Shortcut for checking if the input is a valid 16-bit signed integer or throw error */
export function checkI16Throw(value: number): void {
	if (!isValidI16(value)) {
		throw new InvalidI16Error(value)
	}
}

/** Shortcut for checking if the input is a valid 16-bit unsigned integer or throw error */
export function checkU16Throw(value: number): void {
	if (!isValidU16(value)) {
		throw new InvalidU16Error(value)
	}
}

/** Cast an unsigned integer to an 8-bit signed integer.
 * Only the least significant byte of the input is considered.
 * @param unsignedValue An unsigned number of any size
 * @returns The least significant byte of the input casted into a signed integer */
export function i8(unsignedValue: number): number {
	return ((unsignedValue & 0xff) << 24) >> 24
}

/** Cast a signed integer to an 8-bit unsigned integer.
 * Only the least significant byte of the input is considered.
 * @param signedValue A signed number of any size
 * @returns The least significant byte of the input casted into an unsigned integer */
export function u8(signedValue: number): number {
	return signedValue & 0xff
}

/** Cast an unsigned integer to a 16-bit signed integer.
 * Only the 2 least significant bytes of the input are considered.
 * @param unsignedValue An unsigned number of any size
 * @returns The 2 least significant bytes of the input casted into a signed integer */
export function i16(unsignedValue: number): number {
	return ((unsignedValue & 0xffff) << 16) >> 16
}

/** Cast a signed integer to a 16-bit unsigned integer.
 * Only the 2 least significant bytes of the input are considered.
 * @param signedValue A signed number of any size
 * @returns The 2 least significant bytes of the input casted into an unsigned integer */
export function u16(signedValue: number): number {
	return signedValue & 0xffff
}

/** Return the most significant byte of a 16-bit signed integer.
 * @param signedValue A signed number of any size
 * @returns The 2nd least significant byte as an unsigned 8-bit integer */
export function i16MSB(signedValue: number): number {
	return (signedValue & 0xff00) >>> 8
}

/** Return the least significant byte of a 16-bit signed integer.
 * @param signedValue A signed number of any size
 * @returns The least significant byte as an unsigned 8-bit integer */
export function i16LSB(signedValue: number): number {
	return signedValue & 0xff
}

/** Return the most significant byte of a 16-bit unsigned integer.
 * @param unsignedValue An unsigned number of any size
 * @returns The 2nd least significant byte as an unsigned 8-bit integer */
export function u16MSB(unsignedValue: number): number {
	return unsignedValue >>> 8
}

/** Return the least significant byte of a 16-bit unsigned integer.
 * @param unsignedValue An unsigned number of any size
 * @returns The least significant byte as an unsigned 8-bit integer */
export function u16LSB(unsignedValue: number): number {
	return unsignedValue & 0xff
}

/** Join 2 8-bit unsigned integers into a 16-bit signed integer.
 * The input bytes are assumed to be valid 8-bit unsigned integers.
 * @param msb The most significant byte (unsigned)
 * @param lsb The least significant byte (unsigned)
 * @returns A 16-bit signed integer */
export function joinU8ToI16(msb: number, lsb: number): number {
	return (((msb << 8) | lsb) << 16) >> 16
}

/** Join 2 8-bit unsigned integers into a 16-bit unsigned integer.
 * The input bytes are assumed to be valid 8-bit unsigned integers.
 * @param msb The most significant byte (unsigned)
 * @param lsb The least significant byte (unsigned)
 * @returns A 16-bit unsigned integer */
export function joinU8ToU16(msb: number, lsb: number): number {
	return (msb << 8) | lsb
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
