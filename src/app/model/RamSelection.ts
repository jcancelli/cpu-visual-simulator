import { Subscriber, Unsubscriber } from "svelte/store"
import { LAST_ADDRESS, FIRST_ADDRESS, isValidAddress } from "../util/ram"
import { WORD_SIZE } from "../util/cpu"
import { tick } from "svelte"
import { Writable, writable } from "../util/customStores"

export enum RamSelectionColumn {
	CELL = "CELL",
	LABEL = "LABEL"
}

interface Selection {
	address: number | null
	column: RamSelectionColumn
}

type Invalidator<T> = (value?: T) => void

export class RamSelection {
	private selection: Writable<Selection> = writable({
		address: null,
		column: RamSelectionColumn.CELL
	})

	public subscribe(run: Subscriber<Selection>, invalidate?: Invalidator<Selection>): Unsubscriber {
		return this.selection.subscribe(run, invalidate)
	}

	public async selectDown(): Promise<void> {
		this.selection.update(previous => {
			let newAddress = previous.address + WORD_SIZE
			return {
				...previous,
				address: newAddress > LAST_ADDRESS ? LAST_ADDRESS : newAddress
			}
		})
		await tick()
	}

	public async selectUp(): Promise<void> {
		this.selection.update(previous => {
			let newAddress = previous.address - WORD_SIZE
			return {
				...previous,
				address: newAddress < FIRST_ADDRESS ? FIRST_ADDRESS : newAddress
			}
		})
		await tick()
	}

	public async selectLeft(): Promise<void> {
		this.selection.update(previous => ({
			...previous,
			column: RamSelectionColumn.LABEL
		}))
		await tick()
	}

	public async selectRight(): Promise<void> {
		this.selection.update(previous => ({
			...previous,
			column: RamSelectionColumn.CELL
		}))
		await tick()
	}

	public async select(address: number, column: RamSelectionColumn = RamSelectionColumn.CELL): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		this.selection.update(previous => ({
			...previous,
			address,
			column
		}))
		await tick()
	}

	public async deselect(): Promise<void> {
		this.selection.update(previous => ({
			...previous,
			address: null
		}))
		await tick()
	}

	public noSelection() {
		return this.selection.get().address === null
	}

	public isSelected(address: number, column: RamSelectionColumn): boolean {
		return this.selection.get().address === address && this.selection.get().column === column
	}
}
