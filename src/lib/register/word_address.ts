import {
	assertWordAlignedAddress,
	FIRST_ADDRESS,
	type WordAlignedAddress,
} from "$lib/types/address"
import type { U8 } from "$lib/types/integer"
import { ByteRegisterImpl, type ByteRegister } from "./register.svelte"

/** Register that can store a valid memory operation value */
export interface WordAddressRegister extends ByteRegister {
	/** The value of the address */
	get address(): WordAlignedAddress
	/** The value of the address.
	 * @throws {InvalidWordAddressError} */
	set address(address: WordAlignedAddress)
}

/** Implementation of {@link WordAddressRegisterImpl} */
export class WordAddressRegisterImpl extends ByteRegisterImpl implements WordAddressRegister {
	constructor(initialValue: WordAlignedAddress = FIRST_ADDRESS as WordAlignedAddress) {
		super(initialValue)
	}

	get address(): WordAlignedAddress {
		return this.unsigned as WordAlignedAddress
	}

	set address(address: WordAlignedAddress) {
		this.unsigned = address
	}

	protected override assertValid(value: U8): void {
		assertWordAlignedAddress(value)
	}
}
