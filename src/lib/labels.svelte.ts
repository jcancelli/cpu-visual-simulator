import {
	assertWordAlignedAddress,
	MAX_WORD_ADDRESS,
	MEMORY_SIZE_BYTES,
	MIN_ADDRESS,
	WORD_ALIGNMENT,
	type WordAlignedAddress,
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

/** A valid memory address label */
export type Label = string & { __validLabel: true }

/** Result of a label validation */
export enum LabelValidationResult {
	/** The label is valid */
	VALID,
	/** The label is longer than {@link LABEL_MAX_LENGTH} */
	TOO_LONG,
	/** The label is an empty string */
	EMPTY,
	/** The label contains an invalid character */
	FORBIDDEN_CHARACTER,
}

/** Failure of a label validation */
export type LabelValidationFail = Exclude<LabelValidationResult, LabelValidationResult.VALID>

/** Check if the provided string contains a valid label between startIndex (inclusive) and endIndex (not inclusive).
 * @returns
 * - {@link LabelValidationResult.TOO_LONG} if the label is longer than {@link LABEL_MAX_LENGTH}
 * - {@link LabelValidationResult.EMPTY} if the label length === 0
 * - {@link LabelValidationResult.FORBIDDEN_CHARACTER} if the label contains a character that is not allowed in a label
 * - {@link LabelValidationResult.VALID} if the label is valid */
export function validateLabel(
	str: string,
	startIndex: number = 0,
	endIndex: number = str.length,
): LabelValidationResult {
	if (startIndex > endIndex || endIndex > str.length) {
		unreachable(
			`Invalid indices for string of length ${str.length}. Start index: ${startIndex}, end index: ${endIndex}`,
		)
	}
	const length = endIndex - startIndex
	if (length > LABEL_MAX_LENGTH) {
		return LabelValidationResult.TOO_LONG
	}
	if (length === 0) {
		return LabelValidationResult.EMPTY
	}
	for (let i = startIndex; i < endIndex; i += 1) {
		const charCode = str.charCodeAt(i)
		if (!isValidLabelCharacter(charCode)) {
			return LabelValidationResult.FORBIDDEN_CHARACTER
		}
	}
	return LabelValidationResult.VALID
}

/** Assert that the provided string is a valid {@link Label}.
 * @throws {InvalidLabelError} */
export function assertValidLabel(label: string): asserts label is Label {
	const result = validateLabel(label)
	if (result !== LabelValidationResult.VALID) {
		throw new InvalidLabelError(label, result)
	}
}

export enum LabelEventType {
	MOVED = 1,
	ADDRESS_REMAPPED,
	REMOVED,
}

/** Event emitted when a label is remapped to a new address */
export interface LabelMovedEvent {
	type: typeof LabelEventType.MOVED
	label: Label
	oldAddress: WordAlignedAddress
	newAddress: WordAlignedAddress
}

/** Event emitted when the label mapped to an address is changed */
export interface AddressRemappedEvent {
	type: typeof LabelEventType.ADDRESS_REMAPPED
	address: WordAlignedAddress
	oldLabel: Label
	newLabel: Label
}

/** Event emitted when a label is removed */
export interface LabelRemovedEvent {
	type: typeof LabelEventType.REMOVED
	label: Label
	address: WordAlignedAddress
}

/** Event regarding a label */
export type LabelEvent = LabelMovedEvent | AddressRemappedEvent | LabelRemovedEvent

/** A listener for {@link LabelEvent} */
export type LabelEventListener = (event: LabelEvent) => void

/** Stores the mappings between labels and addresses */
export default class Labels {
	/** Private mutable state that maps an address to a label */
	private _addressToLabel: (Label | null)[]
	/** Private mutable state that maps a label to an address */
	private _labelToAddress: SvelteMap<Label, WordAlignedAddress>
	/** The listeners listening to {@link LabelEvent} emitted by this instance */
	private eventListeners: LabelEventListener[]

	constructor() {
		this._addressToLabel = $state(new Array(MEMORY_SIZE_BYTES).fill(null))
		this._labelToAddress = $state(new SvelteMap())
		this.eventListeners = []
	}

	/** Public readonly derived state that maps an address to a label */
	get addressToLabel(): ReadonlyArray<Label | null> {
		return this._addressToLabel
	}

	/** Public readonly state that maps a label to an address */
	get labelToAddress(): ReadonlyMap<Label, WordAlignedAddress> {
		return this._labelToAddress
	}

	/** Unmap all labels */
	clear(): void {
		for (let address = MIN_ADDRESS; address <= MAX_WORD_ADDRESS; address += WORD_ALIGNMENT) {
			const label = this._addressToLabel[address]
			if (label === null) {
				continue
			}
			this._addressToLabel[address] = null
			this._labelToAddress.delete(label)
			this.notifyListeners({
				type: LabelEventType.REMOVED,
				address: address as WordAlignedAddress,
				label,
			})
		}
	}

	/** Map the specified label to the specified address.
	 * @throws {InvalidLabelError}
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError}
	 * @throws {DuplicateLabelError} */
	mapLabel(label: string, address: number): void {
		assertValidLabel(label)
		assertWordAlignedAddress(address)
		if (this.getAddress(label) !== null) {
			throw new DuplicateLabelError(label)
		}
		const oldLabel = this._addressToLabel[address]
		if (oldLabel !== null) {
			this._labelToAddress.delete(oldLabel)
			this.notifyListeners({
				type: LabelEventType.ADDRESS_REMAPPED,
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
	unmapLabel(label: string): void {
		const address = this.getAddress(label)
		if (address === null) {
			return
		}
		this._labelToAddress.delete(label as Label)
		this._addressToLabel[address] = null
		this.notifyListeners({
			type: LabelEventType.REMOVED,
			label: label as Label,
			address,
		})
	}

	/** Unmap any label mapped to the specified address.
	 * If no label is mapped to the specified address, no operation is performed.
	 * If a label is mapped to the specified address, all listeners are notified with a {@link LabelRemovedEvent}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	unmapAddress(address: number): void {
		assertWordAlignedAddress(address)
		const label = this.getLabel(address)
		if (label === null) {
			return
		}
		this._labelToAddress.delete(label)
		this._addressToLabel[address] = null
		this.notifyListeners({
			type: LabelEventType.REMOVED,
			label,
			address,
		})
	}

	/** @returns The address mapped to the specified label or null if the label does not exist */
	getAddress(label: string): WordAlignedAddress | null {
		return this._labelToAddress.get(label as Label) ?? null
	}

	/** @returns The label mapped to the specified address or null if the address is invalid or if
	 * the address does not have any label mapped to it. */
	getLabel(address: number): Label | null {
		return this._addressToLabel[address] ?? null
	}

	/** Shift down by {@link WORD_ALIGNMENT} all labels from {@link MIN_ADDRESS} to {@link address}.
	 * {@link address} + {@link WORD_ALIGNMENT} is overwritten.
	 * If {@link address} === {@link MAX_WORD_ADDRESS}, the shift is not performed.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link address} + {@link WORD_ALIGNMENT}.
	 * Note: "upperHalf" refers to all the addresses <= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfDownFromAddress(address: number): void {
		if (address === MAX_WORD_ADDRESS) {
			// Noop if it's trying to shift from the last address
			return
		}
		assertWordAlignedAddress(address)
		const upperAddress = MIN_ADDRESS
		const lowerAddress = address + WORD_ALIGNMENT
		for (
			let newAddress = lowerAddress;
			newAddress > upperAddress;
			newAddress -= WORD_ALIGNMENT
		) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this.moveLabel(oldAddress as WordAlignedAddress, newAddress as WordAlignedAddress)
		}
	}

	/** Shift down by {@link WORD_ALIGNMENT} all labels from {@link address} to {@link MAX_WORD_ADDRESS} - {@link WORD_ALIGNMENT}.
	 * {@link MAX_WORD_ADDRESS} is overwritten.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link MAX_WORD_ADDRESS}.
	 * Note: "lowerHalf" refers to all the addresses >= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfDownFromAddress(address: number): void {
		assertWordAlignedAddress(address)
		const upperAddress = address
		const lowerAddress = MAX_WORD_ADDRESS
		for (
			let newAddress = lowerAddress;
			newAddress > upperAddress;
			newAddress -= WORD_ALIGNMENT
		) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this.moveLabel(oldAddress as WordAlignedAddress, newAddress as WordAlignedAddress)
		}
	}

	/** Shift up by {@link WORD_ALIGNMENT} all labels from {@link MIN_ADDRESS} + {@link WORD_ALIGNMENT} to {@link address}.
	 * {@link MIN_ADDRESS} is overwritten.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link MIN_ADDRESS}.
	 * Note: "upperHalf" refers to all the addresses <= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfUpFromAddress(address: number): void {
		assertWordAlignedAddress(address)
		const upperAddress = MIN_ADDRESS
		const lowerAddress = address
		for (
			let newAddress = upperAddress;
			newAddress < lowerAddress;
			newAddress += WORD_ALIGNMENT
		) {
			const oldAddress = newAddress + WORD_ALIGNMENT
			this.moveLabel(oldAddress as WordAlignedAddress, newAddress as WordAlignedAddress)
		}
	}

	/** Shift up by {@link WORD_ALIGNMENT} all labels from {@link address} to {@link MAX_WORD_ADDRESS}.
	 * {@link address}-{@link WORD_ALIGNMENT} is overwritten.
	 * If {@link address} === {@link MIN_ADDRESS}, the shift is not performed.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link address} - {@link WORD_ALIGNMENT}.
	 * Note: "lowerHalf" refers to all the addresses >= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfUpFromAddress(address: number): void {
		if (address === MIN_ADDRESS) {
			// Noop if it's trying to shift from the first address
			return
		}
		assertWordAlignedAddress(address)
		const upperAddress = address - WORD_ALIGNMENT
		const lowerAddress = MAX_WORD_ADDRESS
		for (
			let newAddress = upperAddress;
			newAddress < lowerAddress;
			newAddress += WORD_ALIGNMENT
		) {
			const oldAddress = newAddress + WORD_ALIGNMENT
			this.moveLabel(oldAddress as WordAlignedAddress, newAddress as WordAlignedAddress)
		}
	}

	/** Subscribe the provided {@link LabelEventListener}s to any {@link LabelEvent} emitted by this instance */
	addEventListeners(...listeners: LabelEventListener[]): void {
		this.eventListeners.push(...listeners)
	}

	/** Unsubscribe the provided {@link LabelEventListener}s */
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
	 * listeners are notified with a {@link LabelMovedEvent}.
	 * No validation is performed on the provided addresses. */
	private moveLabel(oldAddress: WordAlignedAddress, newAddress: WordAlignedAddress): void {
		const overwrittenLabel = this._addressToLabel[newAddress]
		if (overwrittenLabel !== null) {
			this._labelToAddress.delete(overwrittenLabel)
			this.notifyListeners({
				type: LabelEventType.REMOVED,
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
				type: LabelEventType.MOVED,
				label: movingLabel,
				oldAddress,
				newAddress,
			})
		}
	}
}

/** Base class for all errors regarding a label */
export abstract class LabelError extends Error {
	/** The label that caused the error */
	public readonly label: string

	constructor(label: string, message: string) {
		super(message)
		this.label = label
	}
}

/** Error regarding a {@link LabelValidationResult} */
export class InvalidLabelError extends LabelError {
	/** The reason why the label is invalid */
	public readonly reason: LabelValidationFail

	constructor(label: string, reason: LabelValidationFail) {
		super(label, `Invalid label: "${label}". Reason: ${LabelValidationResult[reason]}`)
		this.reason = reason
	}
}

/** Error regarding a label that was already mapped to an address */
export class DuplicateLabelError extends LabelError {
	constructor(label: string) {
		super(label, `Duplicate label: "${label}"`)
	}
}

/** Error regarding a label that does not exist */
export class LabelNotFoundError extends LabelError {
	constructor(label: string) {
		super(label, `Label "${label}" does not exist`)
	}
}
