import {
	assertI16,
	assertI8,
	assertU16,
	assertU8,
	i16,
	i8,
	setU16LSB,
	setU16MSB,
	u16,
	u16LSB,
	u16MSB,
	u8,
	type Int,
	type U16,
	type U8,
	type UInt,
} from "$lib/types/integer"

/** The size of a {@link Register} in bits */
export type RegisterSizeBits = 8 | 16

/** A container for an integer of a fixed size */
export interface Register<Bits extends RegisterSizeBits> {
	/** The size in bits for the register */
	readonly sizeBits: number
	/** The value of the register as a signed integer */
	get signed(): Int<Bits>
	/** The value of the register as a signed integer.
	 * @throws {IntegerOutOfRangeError} */
	set signed(value: number)
	/** The value of the register as an unsigned integer */
	get unsigned(): UInt<Bits>
	/** The value of the register as an unsigned integer.
	 * @throws {IntegerOutOfRangeError} */
	set unsigned(value: number)
}

/** A container of an 8-bit integer */
export type ByteRegister = Register<8>

/** A container of a 16-bit integer */
export interface WordRegister extends Register<16> {
	/** The most significant byte of this register as an unsigned 8-bit integer */
	get msb(): U8
	/** The most significant byte of this register as an unsigned 8-bit integer.
	 * @throws {InvalidU8Error} */
	set msb(value: number)
	/** The least significant byte of this register as an unsigned 8-bit integer */
	get lsb(): U8
	/** The least significant byte of this register as an unsigned 8-bit integer.
	 * @throws {InvalidU8Error} */
	set lsb(value: number)
}

/** Base class for the implementation of a {@link Register} */
export abstract class RegisterImpl<Bits extends RegisterSizeBits> implements Register<Bits> {
	/** The size of this register in bits */
	public readonly sizeBits: number
	/** The value of this register as an unsigned integer */
	protected _unsigned: UInt<Bits>

	constructor(sizeBits: Bits, initialValue?: UInt<Bits>) {
		this.sizeBits = sizeBits
		this._unsigned = $state(initialValue ?? (0 as UInt<Bits>))
	}

	/** The value of this register as a signed integer */
	get signed(): Int<Bits> {
		return this.unsignedToSigned(this._unsigned)
	}

	/** The value of this register as a signed integer.
	 * @throws {IntegerOutOfRangeError} */
	set signed(value: number) {
		this.assertSigned(value)
		this._unsigned = this.signedToUnsigned(value)
	}

	/** The value of this register as an unsigned integer */
	get unsigned(): UInt<Bits> {
		return this._unsigned
	}

	/** The value of this register as an unsigned integer.
	 * @throws {IntegerOutOfRangeError} */
	set unsigned(value: number) {
		this.assertUnsigned(value)
		this._unsigned = value
	}

	/** Assert that the provided value is a valid signed integer or {@link Bits} bits */
	protected abstract assertSigned(signed: number): asserts signed is Int<Bits>
	/** Assert that the provided value is a valid unsigned integer or {@link Bits} bits */
	protected abstract assertUnsigned(unsigned: number): asserts unsigned is UInt<Bits>
	/** Cast the provided signed integer of size {@link Bits} to an unsigned integer of the same size */
	protected abstract signedToUnsigned(signed: Int<Bits>): UInt<Bits>
	/** Cast the provided unsigned integer of size {@link Bits} to a signed integer of the same size */
	protected abstract unsignedToSigned(unsigned: UInt<Bits>): Int<Bits>
}

/** Implementation of a {@link ByteRegister} */
export class ByteRegisterImpl extends RegisterImpl<8> implements ByteRegister {
	constructor(initialValue: U8) {
		super(8, initialValue)
	}

	protected override assertSigned(signed: number): asserts signed is Int<8> {
		assertI8(signed)
	}

	protected override assertUnsigned(unsigned: number): asserts unsigned is UInt<8> {
		assertU8(unsigned)
	}

	protected override signedToUnsigned(signed: Int<8>): UInt<8> {
		return u8(signed)
	}

	protected override unsignedToSigned(unsigned: UInt<8>): Int<8> {
		return i8(unsigned)
	}
}

/** Implementation of a {@link WordRegister} */
export class WordRegisterImpl extends RegisterImpl<16> implements WordRegister {
	constructor(initialValue: U16) {
		super(16, initialValue)
	}

	get msb(): U8 {
		return u16MSB(this._unsigned)
	}

	set msb(value: number) {
		assertU8(value)
		this._unsigned = setU16MSB(this._unsigned, value)
	}

	get lsb(): U8 {
		return u16LSB(this.unsigned)
	}

	set lsb(value: number) {
		assertU8(value)
		this._unsigned = setU16LSB(this._unsigned, value)
	}

	protected override assertSigned(signed: number): asserts signed is Int<16> {
		assertI16(signed)
	}

	protected override assertUnsigned(unsigned: number): asserts unsigned is UInt<16> {
		assertU16(unsigned)
	}

	protected override signedToUnsigned(signed: Int<16>): UInt<16> {
		return u16(signed)
	}

	protected override unsignedToSigned(unsigned: UInt<16>): Int<16> {
		return i16(unsigned)
	}
}
