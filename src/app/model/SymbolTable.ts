import CheckedError from "../errors/CheckedError"
import text from "../store/text"
import { derived, Readable, writable, Writable } from "../util/customStores"
import { validateLabel } from "../util/label"
import { FIRST_ADDRESS, isValidAddress, LAST_ADDRESS } from "../util/ram"
import { WORD_SIZE } from "../util/cpu"

/** Event fired when a label is edited (not fired when the label is removed) */
export type LabelEditedEvent = {
	address: number
	oldLabel: string
	newLabel: string
}
/** Event fired when a label is removed */
export type LabelRemovedEvent = {
	address: number
	removedLabel: string
}
/** Callback function called when a label is edited (not fired when a label is removed) */
export type LabelEditedListener = (event: LabelEditedEvent) => void
/** Callback function called when a label is removed */
export type LabelRemovedListener = (event: LabelRemovedEvent) => void
/** Function used to unsubscribe an event listener */
export type Unsubscriber = () => void

/** Class that represents the symbol table state */
export default class SymbolTable {
	/** Read-only store of the labels */
	public readonly labels: Readable<string[]>
	/** Writable store where the labels are written to */
	protected _labels: Writable<string[]>
	/** The value of an empty label */
	public static readonly NO_LABEL: null = null
	protected labelEditedListeners: LabelEditedListener[]
	protected labelRemovedListeners: LabelRemovedListener[]

	constructor() {
		this._labels = writable([])
		this.labels = derived(this._labels, $labels => $labels)
		this.labelEditedListeners = []
		this.labelRemovedListeners = []
		this.clear()
	}

	/**
	 * Maps a label to an address
	 * @param {number} address - The address that should be labeled
	 * @param {string} label - The label
	 */
	setLabel(address: number, label: string): void {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address: " + address)
		}
		const oldLabel = this.getLabel(address)
		if (oldLabel === label || (oldLabel === SymbolTable.NO_LABEL && label === "")) {
			return
		} else if (label === "") {
			this.unlabelAddress(address)
			return
		}
		validateLabel(label) // throws error if invalid label
		if (this.hasLabel(label)) {
			throw new CheckedError(text.get().errors.symbol_table.label_already_exists)
		}
		this._labels.update(oldState => {
			const newState = [...oldState]
			newState[address] = label
			return newState
		})
		if (oldLabel !== SymbolTable.NO_LABEL) {
			this.labelEditedListeners.forEach(listener =>
				listener({
					address,
					oldLabel,
					newLabel: label
				})
			)
		}
	}

	/**
	 * Removes a label from an address
	 * @param {number} address - The address that should be unlabeled
	 */
	unlabelAddress(address: number): void {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address: " + address)
		}
		const oldLabel = this.getLabel(address)
		this._labels.update(oldState => {
			const newState = [...oldState]
			newState[address] = SymbolTable.NO_LABEL
			return newState
		})
		this.labelRemovedListeners.forEach(listener =>
			listener({
				address,
				removedLabel: oldLabel
			})
		)
	}

	/**
	 * Returns the label mapped to the specified address, null if the address has no label
	 * @param {number} address -
	 * @returns {string} The label mapped to the specified address or null if the address has no label
	 */
	getLabel(address: number): string {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address: " + address)
		}
		return this._labels.get()[address]
	}

	/**
	 * The address mapped to the specified label or -1 if the label is not found
	 * @param {string} label - The label
	 * @returns {number} The address mapped to the specified label or -1 if the label is not found
	 */
	getAddress(label: string): number {
		if (label === SymbolTable.NO_LABEL) {
			return -1
		}
		return this._labels.get().findIndex(l => l === label)
	}

	/**
	 * Returns true if the specified label is mapped to an address, otherwise return false
	 * @param {string} label - The label
	 * @returns {boolan} Returns true if the specified label is mapped to an address, otherwise returns false
	 */
	hasLabel(label: string): boolean {
		return this._labels.get().includes(label) && label !== SymbolTable.NO_LABEL
	}

	/**
	 * Returns true if a label is mapped to the specified address, otherwise returns false
	 * @param {number} address - The address
	 * @returns Returns true if a label is mapped to the specified address, otherwise returns false
	 */
	addressIsLabeled(address: number): boolean {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address: " + address)
		}
		return this._labels.get()[address] !== SymbolTable.NO_LABEL
	}

	/** Sets all addresses labels to SymbolTable.NO_LABEL */
	clear(): void {
		const newState: string[] = []
		for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
			newState[address] = SymbolTable.NO_LABEL
		}
		this._labels.set(newState)
	}

	/**
	 * Shifts all the labels of address <= of the specified address by -2 addresses (-1 position).
	 * The label of the first address is lost
	 * @param {number} address
	 */
	moveFirstHalfUpFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Shifts all the labels of address < of the specified address by +2 addresses (+1 position).
	 * The label of the specified address is overwritten by the one before it
	 * @param {number} address
	 */
	moveFirstHalfDownFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Shifts all the labels of address > of the specified address by -2 addresses (-1 position).
	 * The label of the specified address is overwritten by the one after it
	 * @param {number} address
	 */
	moveSecondHalfUpFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Shifts all the labels of address >= of the specified address by +2 addresses (+1 position).
	 * The label of the last address is lost
	 * @param {number} address
	 */
	moveSecondHalfDownFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Subscribes a listener that will be notified when a label is edited (it will not be notified of label removal)
	 * @param {LabelEditedListener} listener - A callback function that will be called everytime a label is edited (it will not be called when a label is removed)
	 * @returns {Unsubscriber} The function used to unsubscribe the listener just subscribed
	 */
	addLabelEditedListener(listener: LabelEditedListener): Unsubscriber {
		this.labelEditedListeners.push(listener)
		return () => (this.labelEditedListeners = this.labelEditedListeners.filter(list => list !== listener))
	}

	/**
	 * Subscribes a listener that will be notified when a label is removed
	 * @param {LabelRemovedListener} listener - A callback function that will be called everytime a label is removed
	 * @returns {Unsubscriber} The function used to unsubscribe the listener just subscribed
	 */
	addLabelRemovedListener(listener: LabelRemovedListener): Unsubscriber {
		this.labelRemovedListeners.push(listener)
		return () => (this.labelRemovedListeners = this.labelRemovedListeners.filter(list => list !== listener))
	}

	*[Symbol.iterator]() {
		const labels = this._labels.get()
		for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
			if (labels[address] !== SymbolTable.NO_LABEL) {
				yield {
					address,
					label: labels[address]
				}
			}
		}
	}
}
