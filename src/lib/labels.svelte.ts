import {
	checkWordAddressThrow,
	MAX_WORD_ADDRESS,
	MEMORY_SIZE_BYTES,
	MIN_ADDRESS,
	WORD_ALIGN,
} from "./memory.svelte"
import { CHAR_CODE_UNDERSCORE, isUppercaseLetter } from "./util/text"
import { unreachable } from "./util/development"
import { SvelteMap } from "svelte/reactivity"

/** Maximum length for a valid label */
export const LABEL_MAX_LENGTH = 10

/** Check if the character represented by the provided char code is a valid label character */
export function isValidLabelCharacter(charCode: number): boolean {
	return isUppercaseLetter(charCode) || charCode === CHAR_CODE_UNDERSCORE
}

/** The label is valid. */
export const VALID_LABEL = 0
/** The label is longer than {@link LABEL_MAX_LENGTH}. */
export const INVALID_LABEL_TOO_LONG = 1
/** The label is an empty string. */
export const INVALID_LABEL_EMPTY = 2
/** An invalid character was found inside the label. */
export const INVALID_LABEL_FORBIDDEN_CHARACTER = 3
export type LabelValidationFail =
	| typeof INVALID_LABEL_TOO_LONG
	| typeof INVALID_LABEL_EMPTY
	| typeof INVALID_LABEL_FORBIDDEN_CHARACTER
export type LabelValidationResult = typeof VALID_LABEL | LabelValidationFail

/** Check if the provided string contains a valid label between startIndex (inclusive) and endIndex (not inclusive).
 * @throws {Error} if startIndex > endIndex or if endIndex > str.length.
 * @returns
 * - {@link INVALID_LABEL_TOO_LONG} if the label is longer than {@link LABEL_MAX_LENGTH}
 * - {@link INVALID_LABEL_EMPTY} if the label length === 0
 * - {@link INVALID_LABEL_FORBIDDEN_CHARACTER} if the label contains a character that is not allowed in a label
 * - {@link VALID_LABEL} if the label is valid */
export function validateLabel(
	str: string,
	startIndex: number = 0,
	endIndex: number = str.length,
): LabelValidationResult {
	if (startIndex > endIndex || endIndex > str.length) {
		throw new Error(
			`Invalid indices for string of length ${str.length}. Start index: ${startIndex}, end index: ${endIndex}`,
		)
	}
	const length = endIndex - startIndex
	if (length > LABEL_MAX_LENGTH) {
		return INVALID_LABEL_TOO_LONG
	}
	if (length === 0) {
		return INVALID_LABEL_EMPTY
	}
	for (let i = startIndex; i < endIndex; i += 1) {
		const charCode = str.charCodeAt(i)
		if (!isValidLabelCharacter(charCode)) {
			return INVALID_LABEL_FORBIDDEN_CHARACTER
		}
	}
	return VALID_LABEL
}

/** Shortcut to check if a label is valid.
 * @throws {InvalidLabelError} if the label is invalid. */
export function checkLabelFormatThrow(label: string): void {
	const result = validateLabel(label)
	if (result !== VALID_LABEL) {
		throw new InvalidLabelError(label, result)
	}
}

export const ADDRESS_CHANGED_LABEL_EVENT = 1
export const ADDRESS_REMAPPED_LABEL_EVENT = 2
export const LABEL_REMOVED_EVENT = 3

/** Event emitted when a label changes address. */
export interface LabelAddressChangeEvent {
	type: typeof ADDRESS_CHANGED_LABEL_EVENT
	label: string
	oldAddress: number
	newAddress: number
}

/** Event emitted when the label mapped to an address is changed. */
export interface AddressRemappedEvent {
	type: typeof ADDRESS_REMAPPED_LABEL_EVENT
	address: number
	oldLabel: string
	newLabel: string
}

/** Event emitted when a label is removed. */
export interface LabelRemovedEvent {
	type: typeof LABEL_REMOVED_EVENT
	label: string
	address: number
}

/** Represents an event regarding a label. */
export type LabelEvent = LabelAddressChangeEvent | AddressRemappedEvent | LabelRemovedEvent

/** A listener for {@link LabelEvent}s. */
export type LabelEventListener = (event: LabelEvent) => void

/** Stores the mappings between labels and addresses. */
export default class Labels {
	/** Public readonly derived state that maps an address to a label. */
	public readonly addressToLabel: (string | null)[]
	/** Private mutable state that maps an address to a label. */
	private _addressToLabel: (string | null)[]
	/** Public readonly derived state that maps a label to an address. */
	public readonly labelToAddress: SvelteMap<string, number>
	/** Private mutable state that maps a label to an address. */
	private _labelToAddress: SvelteMap<string, number>
	private eventListeners: LabelEventListener[]

	constructor() {
		this._addressToLabel = $state(new Array(MEMORY_SIZE_BYTES).fill(null))
		this.addressToLabel = $derived(this._addressToLabel)
		this._labelToAddress = $state(new SvelteMap())
		this.labelToAddress = $derived(this._labelToAddress)
		this.eventListeners = []
	}

	/** Remove all labels. */
	clear(): void {
		for (let address = MIN_ADDRESS; address <= MAX_WORD_ADDRESS; address += WORD_ALIGN) {
			const label = this._addressToLabel[address]
			if (label === null) {
				continue
			}
			this._addressToLabel[address] = null
			this._labelToAddress.delete(label)
			this.notifyListeners({
				type: LABEL_REMOVED_EVENT,
				address,
				label,
			})
		}
	}

	/** Map the specified label to the specified address.
	 * @throws {InvalidLabelError} if the label is invalid.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address.
	 * @throws {DuplicateLabelError} if the same label is already mapped to an address. */
	setLabel(label: string, address: number): void {
		checkLabelFormatThrow(label)
		checkWordAddressThrow(address)
		if (this.getAddress(label) !== null) {
			throw new DuplicateLabelError(label)
		}
		const oldLabel = this._addressToLabel[address]
		if (oldLabel !== null) {
			this._labelToAddress.delete(oldLabel)
			this.notifyListeners({
				type: ADDRESS_REMAPPED_LABEL_EVENT,
				oldLabel,
				newLabel: label,
				address,
			})
		}
		this._addressToLabel[address] = label
		this._labelToAddress.set(label, address)
	}

	/** Unmap the specified label.
	 * If the specified label is not mapped to any address, no operation is performed.
	 * If the specified label exist, all listeners are notified with a {@link LabelRemovedEvent}. */
	clearLabel(label: string): void {
		const address = this.getAddress(label)
		if (address === null) {
			return
		}
		this._labelToAddress.delete(label)
		this._addressToLabel[address] = null
		this.notifyListeners({
			type: LABEL_REMOVED_EVENT,
			label,
			address,
		})
	}

	/** Unmap any label mapped to the specified address.
	 * If no label is mapped to the specified address, no operation is performed.
	 * If a label is mapped to the specified address, all listeners are notified with a {@link LabelRemovedEvent}.
	 * @throws {InvalidWordAddressError} if the specified address is not a valid word address. */
	clearAddress(address: number): void {
		checkWordAddressThrow(address)
		const label = this.getLabel(address)
		if (label === null) {
			return
		}
		this._labelToAddress.delete(label)
		this._addressToLabel[address] = null
		this.notifyListeners({
			type: LABEL_REMOVED_EVENT,
			label,
			address,
		})
	}

	/** @returns The address mapped to the specified label or null if the label does not exist */
	getAddress(label: string): number | null {
		return this._labelToAddress.get(label) ?? null
	}

	/** @returns The label mapped to the specified address or null if the address is invalid or if
	 * the address does not have any label mapped to it. */
	getLabel(address: number): string | null {
		return this._addressToLabel[address] ?? null
	}

	/** Shift down by {@link WORD_ALIGN} all labels from {@link MIN_ADDRESS} to {@link address}.
	 * {@link address} + {@link WORD_ALIGN} is overwritten.
	 * If {@link address} === {@link MAX_WORD_ADDRESS}, the shift is not performed.
	 * A {@link LabelAddressChangeEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link address} + {@link WORD_ALIGN}.
	 * Note: "upperHalf" refers to all the addresses <= {@link address}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftUpperHalfDownFromAddress(address: number): void {
		if (address === MAX_WORD_ADDRESS) {
			// Noop if it's trying to shift from the last address
			return
		}
		checkWordAddressThrow(address)
		const upperAddress = MIN_ADDRESS
		const lowerAddress = address + WORD_ALIGN
		for (let newAddress = lowerAddress; newAddress > upperAddress; newAddress -= WORD_ALIGN) {
			const oldAddress = newAddress - WORD_ALIGN
			this.moveLabel(oldAddress, newAddress)
		}
	}

	/** Shift down by {@link WORD_ALIGN} all labels from {@link address} to {@link MAX_WORD_ADDRESS} - {@link WORD_ALIGN}.
	 * {@link MAX_WORD_ADDRESS} is overwritten.
	 * A {@link LabelAddressChangeEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link MAX_WORD_ADDRESS}.
	 * Note: "lowerHalf" refers to all the addresses >= {@link address}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftLowerHalfDownFromAddress(address: number): void {
		checkWordAddressThrow(address)
		const upperAddress = address
		const lowerAddress = MAX_WORD_ADDRESS
		for (let newAddress = lowerAddress; newAddress > upperAddress; newAddress -= WORD_ALIGN) {
			const oldAddress = newAddress - WORD_ALIGN
			this.moveLabel(oldAddress, newAddress)
		}
	}

	/** Shift up by {@link WORD_ALIGN} all labels from {@link MIN_ADDRESS} + {@link WORD_ALIGN} to {@link address}.
	 * {@link MIN_ADDRESS} is overwritten.
	 * A {@link LabelAddressChangeEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link MIN_ADDRESS}.
	 * Note: "upperHalf" refers to all the addresses <= {@link address}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftUpperHalfUpFromAddress(address: number): void {
		checkWordAddressThrow(address)
		const upperAddress = MIN_ADDRESS
		const lowerAddress = address
		for (let newAddress = upperAddress; newAddress < lowerAddress; newAddress += WORD_ALIGN) {
			const oldAddress = newAddress + WORD_ALIGN
			this.moveLabel(oldAddress, newAddress)
		}
	}

	/** Shift up by {@link WORD_ALIGN} all labels from {@link address} to {@link MAX_WORD_ADDRESS}.
	 * {@link address}-{@link WORD_ALIGN} is overwritten.
	 * If {@link address} === {@link MIN_ADDRESS}, the shift is not performed.
	 * A {@link LabelAddressChangeEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link address} - {@link WORD_ALIGN}.
	 * Note: "lowerHalf" refers to all the addresses >= {@link address}.
	 * @throws {InvalidWordAddressError} if the address is not a valid word address. */
	shiftLowerHalfUpFromAddress(address: number): void {
		if (address === MIN_ADDRESS) {
			// Noop if it's trying to shift from the first address
			return
		}
		checkWordAddressThrow(address)
		const upperAddress = address - WORD_ALIGN
		const lowerAddress = MAX_WORD_ADDRESS
		for (let newAddress = upperAddress; newAddress < lowerAddress; newAddress += WORD_ALIGN) {
			const oldAddress = newAddress + WORD_ALIGN
			this.moveLabel(oldAddress, newAddress)
		}
	}

	/** Subscribe the provided {@link LabelEventListener}s to any {@link LabelEvent} emitted by this instance. */
	addEventListeners(...listeners: LabelEventListener[]): void {
		this.eventListeners.push(...listeners)
	}

	/** Unsubscribe the provided {@link LabelEventListener}s. */
	removeEventListeners(...listeners: LabelEventListener[]): void {
		let newLength = this.eventListeners.length
		for (const toRemove of listeners) {
			for (let i = 0; i < newLength; i += 1) {
				if (toRemove === this.eventListeners[i]) {
					this.eventListeners[i] = this.eventListeners[newLength - 1]
					newLength -= 1
				}
			}
		}
		this.eventListeners.splice(newLength, this.eventListeners.length - newLength)
	}

	/** Notify all event listeners with the specified {@link LabelEvent} */
	private notifyListeners(event: LabelEvent): void {
		for (const listener of this.eventListeners) {
			listener(event)
		}
	}

	/** Move one label from one address to another.
	 * If a label is mapped to {@link newAddress}, that label is removed and all listeners are
	 * notified with a {@link LabelRemovedEvent}.
	 * If a label is mapped to {@link oldAddress}, that label is moved to {@link newAddress} and all
	 * listeners are notified with a {@link LabelAddressChangeEvent}.
	 * No validation is performed on the provided addresses. */
	private moveLabel(oldAddress: number, newAddress: number): void {
		const overwrittenLabel = this._addressToLabel[newAddress]
		if (overwrittenLabel !== null) {
			this._labelToAddress.delete(overwrittenLabel)
			this.notifyListeners({
				type: LABEL_REMOVED_EVENT,
				label: overwrittenLabel,
				address: newAddress,
			})
		}
		const movingLabel = this._addressToLabel[oldAddress]
		this._addressToLabel[newAddress] = movingLabel
		this._addressToLabel[oldAddress] = null
		if (movingLabel !== null) {
			this._labelToAddress.set(movingLabel, newAddress)
			this.notifyListeners({
				type: ADDRESS_CHANGED_LABEL_EVENT,
				label: movingLabel,
				oldAddress,
				newAddress,
			})
		}
	}
}

/** Base class for all errors regarding a label. */
export abstract class LabelError extends Error {
	public readonly label: string
	constructor(label: string, message: string) {
		super(message)
		this.label = label
	}
}

/** Error regarding a {@link LabelValidationFail}. */
export class InvalidLabelError extends LabelError {
	public readonly reason: LabelValidationFail

	constructor(label: string, reason: LabelValidationFail) {
		let reasonStr
		if (reason === INVALID_LABEL_TOO_LONG) {
			reasonStr = "TOO_LONG"
		} else if (reason === INVALID_LABEL_FORBIDDEN_CHARACTER) {
			reasonStr = "FORBIDDEN_CHARACTER"
		} else {
			unreachable()
		}
		super(label, `Invalid label: "${label}". Reason: ${reasonStr}`)
		this.reason = reason
	}
}

/** Error regarding a label that was already mapped to an address. */
export class DuplicateLabelError extends LabelError {
	constructor(label: string) {
		super(label, `Duplicate label: "${label}"`)
	}
}

/** Error regarding a label that does not exist. */
export class LabelNotFoundError extends LabelError {
	constructor(label: string) {
		super(label, `Label "${label}" does not exist`)
	}
}
