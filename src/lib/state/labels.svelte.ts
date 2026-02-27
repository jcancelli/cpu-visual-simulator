import { SvelteMap } from "svelte/reactivity"
import {
	assertWordAlignedAddress,
	LAST_WORD_ADDRESS,
	MEMORY_SIZE_BYTES,
	FIRST_ADDRESS,
	WORD_ALIGNMENT,
	type WordAlignedAddress,
} from "$lib/types/address"
import { assertLabel, type Label } from "$lib/types/label"
import { DuplicateLabelError } from "$lib/errors/label"

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
		for (let address = FIRST_ADDRESS; address <= LAST_WORD_ADDRESS; address += WORD_ALIGNMENT) {
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
		assertLabel(label)
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

	/** Shift down by {@link WORD_ALIGNMENT} all labels from {@link FIRST_ADDRESS} to {@link address}.
	 * {@link address} + {@link WORD_ALIGNMENT} is overwritten.
	 * If {@link address} === {@link LAST_WORD_ADDRESS}, the shift is not performed.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link address} + {@link WORD_ALIGNMENT}.
	 * Note: "upperHalf" refers to all the addresses <= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfDownFromAddress(address: number): void {
		if (address === LAST_WORD_ADDRESS) {
			// Noop if it's trying to shift from the last address
			return
		}
		assertWordAlignedAddress(address)
		const upperAddress = FIRST_ADDRESS
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

	/** Shift down by {@link WORD_ALIGNMENT} all labels from {@link address} to {@link LAST_WORD_ADDRESS} - {@link WORD_ALIGNMENT}.
	 * {@link LAST_WORD_ADDRESS} is overwritten.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link LAST_WORD_ADDRESS}.
	 * Note: "lowerHalf" refers to all the addresses >= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfDownFromAddress(address: number): void {
		assertWordAlignedAddress(address)
		const upperAddress = address
		const lowerAddress = LAST_WORD_ADDRESS
		for (
			let newAddress = lowerAddress;
			newAddress > upperAddress;
			newAddress -= WORD_ALIGNMENT
		) {
			const oldAddress = newAddress - WORD_ALIGNMENT
			this.moveLabel(oldAddress as WordAlignedAddress, newAddress as WordAlignedAddress)
		}
	}

	/** Shift up by {@link WORD_ALIGNMENT} all labels from {@link FIRST_ADDRESS} + {@link WORD_ALIGNMENT} to {@link address}.
	 * {@link FIRST_ADDRESS} is overwritten.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link FIRST_ADDRESS}.
	 * Note: "upperHalf" refers to all the addresses <= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftUpperHalfUpFromAddress(address: number): void {
		assertWordAlignedAddress(address)
		const upperAddress = FIRST_ADDRESS
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

	/** Shift up by {@link WORD_ALIGNMENT} all labels from {@link address} to {@link LAST_WORD_ADDRESS}.
	 * {@link address}-{@link WORD_ALIGNMENT} is overwritten.
	 * If {@link address} === {@link FIRST_ADDRESS}, the shift is not performed.
	 * A {@link LabelMovedEvent} is emitted for every label that was shifted.
	 * A {@link LabelRemovedEvent} is emitted if a label was mapped to {@link address} - {@link WORD_ALIGNMENT}.
	 * Note: "lowerHalf" refers to all the addresses >= {@link address}.
	 * @throws {AddressOutOfRangeError}
	 * @throws {InvalidWordAlignedAddressError} */
	shiftLowerHalfUpFromAddress(address: number): void {
		if (address === FIRST_ADDRESS) {
			// Noop if it's trying to shift from the first address
			return
		}
		assertWordAlignedAddress(address)
		const upperAddress = address - WORD_ALIGNMENT
		const lowerAddress = LAST_WORD_ADDRESS
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
