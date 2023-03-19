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
/** Event fired when a label is moved from one address to another */
export type LabelMovedEvent = {
	label: string
	oldAddress: number
	newAddress: number
}
/** Event fired when a label is removed */
export type LabelRemovedEvent = {
	address: number
	removedLabel: string
}
/** Callback function called when a label is edited (not fired when a label is removed) */
export type LabelEditedListener = (event: LabelEditedEvent) => void
/** Callback function called when a label is moved from one address to another */
export type LabelMovedListener = (event: LabelMovedEvent) => void
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
	protected labelMovedListeners: LabelMovedListener[]
	protected labelRemovedListeners: LabelRemovedListener[]

	constructor() {
		this._labels = writable([])
		this.labels = derived(this._labels, $labels => $labels)
		this.labelEditedListeners = []
		this.labelMovedListeners = []
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
			this.notifyLabelEditedListeners(address, oldLabel, label)
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
		this.notifyLabelRemovedListeners(address, oldLabel)
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
	 * Overwrites its instance labels with the labels of the symbolTable object passed as argument.
	 * Doesn't fire any listener (except for the ones directly subscribed to the labels store)
	 * @param {SymbolTable} symbolTable - Tha SymbolTable object that should be imported
	 */
	import(symbolTable: SymbolTable): void {
		this._labels.set([...symbolTable.labels.get()])
	}

	/**
	 * Shifts all the labels of address <= of the specified address by -2 addresses (-1 position).
	 * The label of the first address is lost
	 * @param {number} shiftAddress
	 */
	moveFirstHalfUpFromAddress(shiftAddress: number): void {
		const oldState = this._labels.get()
		const newState = [
			...oldState.slice(FIRST_ADDRESS + WORD_SIZE, shiftAddress + WORD_SIZE),
			SymbolTable.NO_LABEL,
			undefined,
			...oldState.slice(shiftAddress + WORD_SIZE)
		]
		this._labels.set(newState)
		if (oldState[FIRST_ADDRESS] !== SymbolTable.NO_LABEL) {
			this.notifyLabelRemovedListeners(FIRST_ADDRESS, oldState[FIRST_ADDRESS])
		}
		for (const { label, address } of this) {
			if (address < shiftAddress) {
				this.notifyLabelMovedListeners(label, address + WORD_SIZE, address)
			}
		}
	}

	/**
	 * Shifts all the labels of address < of the specified address by +2 addresses (+1 position).
	 * The label of the specified address is deleted/overwritten by the one before it
	 * @param {number} shiftAddress
	 */
	moveFirstHalfDownFromAddress(shiftAddress: number): void {
		const oldState = this._labels.get()
		const newState = [
			SymbolTable.NO_LABEL,
			undefined,
			...oldState.slice(FIRST_ADDRESS, shiftAddress),
			...oldState.slice(shiftAddress + WORD_SIZE)
		]
		this._labels.set(newState)
		if (oldState[shiftAddress] !== SymbolTable.NO_LABEL) {
			this.notifyLabelRemovedListeners(shiftAddress, oldState[shiftAddress])
		}
		for (const { label, address } of this) {
			if (address <= shiftAddress) {
				this.notifyLabelMovedListeners(label, address - WORD_SIZE, address)
			}
		}
	}

	/**
	 * Shifts all the labels of address > of the specified address by -2 addresses (-1 position).
	 * The label of the specified address is overwritten by the one after it
	 * @param {number} shiftAddress
	 */
	moveSecondHalfUpFromAddress(shiftAddress: number): void {
		const oldState = this._labels.get()
		const newState = [
			...oldState.slice(FIRST_ADDRESS, shiftAddress),
			...oldState.slice(shiftAddress + WORD_SIZE),
			undefined,
			SymbolTable.NO_LABEL
		]
		this._labels.set(newState)
		if (oldState[shiftAddress] !== SymbolTable.NO_LABEL) {
			this.notifyLabelRemovedListeners(shiftAddress, oldState[shiftAddress])
		}
		for (const { label, address } of this) {
			if (address >= shiftAddress) {
				this.notifyLabelMovedListeners(label, address + WORD_SIZE, address)
			}
		}
	}

	/**
	 * Shifts all the labels of address >= of the specified address by +2 addresses (+1 position).
	 * The label of the last address is lost
	 * @param {number} shiftAddress
	 */
	moveSecondHalfDownFromAddress(shiftAddress: number): void {
		const oldState = this._labels.get()
		const newState = [
			...oldState.slice(FIRST_ADDRESS, shiftAddress),
			SymbolTable.NO_LABEL,
			undefined,
			...oldState.slice(shiftAddress, LAST_ADDRESS - 1)
		]
		this._labels.set(newState)
		if (oldState[LAST_ADDRESS] !== SymbolTable.NO_LABEL) {
			this.notifyLabelRemovedListeners(LAST_ADDRESS, oldState[LAST_ADDRESS])
		}
		for (const { label, address } of this) {
			if (address > shiftAddress) {
				this.notifyLabelMovedListeners(label, address - WORD_SIZE, address)
			}
		}
	}

	/**
	 * Subscribes a listener that will be notified when a label is edited (it will not be notified of label removal)
	 * @param {LabelEditedListener} listener - A callback function that will be called everytime a label is edited (it will not be called when a label is removed)
	 * @returns {Unsubscriber} The function used to unsubscribe the listener just subscribed
	 */
	addLabelEditedListener(listener: LabelEditedListener): Unsubscriber {
		this.labelEditedListeners.push(listener)
		return () => (this.labelEditedListeners = this.labelEditedListeners.filter(e => e !== listener))
	}

	/**
	 * Subscribes a listener that will be notified when a label is moved from one address to another
	 * @param {LabelMovedListener} listener - A callback function that will be called everytime a label is moved from one address to another
	 * @returns {Unsubscriber} The function used to unsubscribe the listener just subscribed
	 */
	addLabelMovedListener(listener: LabelMovedListener): Unsubscriber {
		this.labelMovedListeners.push(listener)
		return () => (this.labelMovedListeners = this.labelMovedListeners.filter(e => e !== listener))
	}

	/**
	 * Subscribes a listener that will be notified when a label is removed
	 * @param {LabelRemovedListener} listener - A callback function that will be called everytime a label is removed
	 * @returns {Unsubscriber} The function used to unsubscribe the listener just subscribed
	 */
	addLabelRemovedListener(listener: LabelRemovedListener): Unsubscriber {
		this.labelRemovedListeners.push(listener)
		return () => (this.labelRemovedListeners = this.labelRemovedListeners.filter(e => e !== listener))
	}

	/**
	 * Fires all the listeners subscribed with the addLabelEditedListener method
	 * @param {number} address - The address of the edited label
	 * @param {string} oldLabel - The old value of the label
	 * @param {string} newLabel - The new value of the label
	 */
	private notifyLabelEditedListeners(address: number, oldLabel: string, newLabel: string): void {
		this.labelEditedListeners.forEach(listener =>
			listener({
				address,
				oldLabel,
				newLabel
			})
		)
	}

	/**
	 * Fires all the listeners subscribed with the addLabelMovedListener method
	 * @param {string} label - The label that was moved
	 * @param {string} oldAddress - The old address of the label
	 * @param {string} newAddress - The new address of the label
	 */
	private notifyLabelMovedListeners(label: string, oldAddress: number, newAddress: number): void {
		this.labelMovedListeners.forEach(listener =>
			listener({
				label,
				oldAddress,
				newAddress
			})
		)
	}

	/**
	 * Fires all the listeners subscribed with the addLabelRemovedListener method
	 * @param {number} address - The address of the removed label
	 * @param {string} removedLabel - The value of the removed label
	 */
	private notifyLabelRemovedListeners(address: number, removedLabel: string): void {
		this.labelRemovedListeners.forEach(listener =>
			listener({
				address,
				removedLabel
			})
		)
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
