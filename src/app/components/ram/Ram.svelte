<script lang="ts">
	import { isValidAddress, FIRST_ADDRESS, LAST_ADDRESS, addressToIndex } from "../../util/ram"
	import { WORD_SIZE } from "../../util/cpu"
	import Label from "./Label.svelte"
	import Address from "./Address.svelte"
	import Cell from "./Cell.svelte"
	import ComponentLabel from "../labels/Component.svelte"
	import ramSelection from "../../store/ramSelection"
	import { beforeUpdate, afterUpdate, tick } from "svelte"
	import Button from "./Button.svelte"
	import text from "../../store/text"
	import Ram from "../../model/Ram"
	import SymbolTable from "../../model/SymbolTable"

	export let ram: Ram
	export let symbolTable: SymbolTable
	export let animationsEnabled: boolean

	const VISIBLE_CELLS = 18

	const instructionsStore = ram.instructions
	const labelsStore = symbolTable.labels

	let firstVisibleAddress: number = FIRST_ADDRESS
	let lastVisibleAddress: number
	let visibleAddresses: number[]

	let labelElements: Label[] = []
	let addressElements: Address[] = []
	let cellElements: Cell[] = []

	updateVisibleAddresses()

	export async function scrollUp(): Promise<void> {
		return scroll(-1, true)
	}

	export async function scrollDown(): Promise<void> {
		return scroll(1, true)
	}

	export async function showAddress(address: number): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		if (addressIsVisible(address)) {
			return
		}
		let tmpFirstAddress = address
		let tmpLastAddress = tmpFirstAddress + (VISIBLE_CELLS - 1) * WORD_SIZE
		if (tmpLastAddress > LAST_ADDRESS) {
			tmpFirstAddress -= tmpLastAddress - LAST_ADDRESS
		}
		firstVisibleAddress = tmpFirstAddress
		return updateVisibleAddresses()
	}

	export function addressIsVisible(address: number): boolean {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		return address >= firstVisibleAddress && address <= lastVisibleAddress
	}

	export async function flashAddress(address: number): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		if (!animationsEnabled) return
		return showAddress(address).then(() =>
			addressElements.find(addressElement => addressElement?.getAddress?.() === address)?.flash()
		)
	}

	export async function flashContent(address: number): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		if (!animationsEnabled) return
		return showAddress(address).then(() =>
			cellElements.find(cellElement => cellElement?.getAddress?.() === address)?.flash()
		) // sometimes throws a "cellElement.getAddress() is not a function" error, idk why, therefore the "?." operator. Don't even kwon how to replicate the error
	}

	export async function selectCell(address: number): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		await showAddress(address)
		return ramSelection.select(address)
	}

	async function updateVisibleAddresses(): Promise<void> {
		lastVisibleAddress = firstVisibleAddress + (VISIBLE_CELLS - 1) * WORD_SIZE
		visibleAddresses = []
		for (let i = firstVisibleAddress, j = 0; i <= lastVisibleAddress; i += WORD_SIZE, j++) {
			visibleAddresses[j] = i
		}
		return tick()
	}

	async function scroll(deltaY: number, deselect: boolean): Promise<void> {
		if (deselect) {
			await ramSelection.deselect()
		}
		let newFirstVisibleAddress = firstVisibleAddress + (deltaY > 0 ? WORD_SIZE : -WORD_SIZE)
		if (newFirstVisibleAddress < FIRST_ADDRESS) {
			newFirstVisibleAddress = FIRST_ADDRESS
		}
		if (newFirstVisibleAddress > LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE) {
			newFirstVisibleAddress = LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE
		}
		firstVisibleAddress = newFirstVisibleAddress
		return updateVisibleAddresses()
	}

	async function onArrowUp(e: KeyboardEvent): Promise<void> {
		const selectedAddress = $ramSelection.address
		const selectedColumn = $ramSelection.column
		const prevAddress = selectedAddress - WORD_SIZE

		if (ramSelection.noSelection()) {
			return
		}
		if (e.ctrlKey) {
			await ramSelection.deselect()
			ram.moveSecondHalfUpFromAddress(selectedAddress)
			symbolTable.moveSecondHalfUpFromAddress(selectedAddress)
			await showAddress(selectedAddress)
			await ramSelection.select(selectedAddress, selectedColumn)
			return
		}
		if (e.shiftKey) {
			await ramSelection.deselect()
			ram.moveFirstHalfUpFromAddress(selectedAddress)
			symbolTable.moveFirstHalfUpFromAddress(selectedAddress)
			if (isValidAddress(prevAddress)) {
				await showAddress(prevAddress)
				await ramSelection.select(prevAddress, selectedColumn)
			}
			return
		}
		if (e.altKey && isValidAddress(prevAddress)) {
			await ramSelection.deselect()
			ram.swapAddresses(selectedAddress, prevAddress)
			symbolTable.swapAddresses(selectedAddress, prevAddress)
			await showAddress(prevAddress)
			await ramSelection.select(prevAddress, selectedColumn)
			return
		}
		if (isValidAddress(prevAddress)) {
			await showAddress(prevAddress)
			await ramSelection.select(prevAddress, selectedColumn)
			return
		}
	}

	async function onArrowDown(e: KeyboardEvent): Promise<void> {
		const selectedAddress = $ramSelection.address
		const selectedColumn = $ramSelection.column
		const nextAddress = selectedAddress + WORD_SIZE

		if (ramSelection.noSelection()) {
			return
		}
		if (e.ctrlKey) {
			await ramSelection.deselect()
			ram.moveSecondHalfDownFromAddress(selectedAddress)
			symbolTable.moveSecondHalfDownFromAddress(selectedAddress)
			if (isValidAddress(nextAddress)) {
				await showAddress(nextAddress)
				await ramSelection.select(nextAddress, selectedColumn)
			}
			return
		}
		if (e.shiftKey) {
			await ramSelection.deselect()
			ram.moveFirstHalfDownFromAddress(selectedAddress)
			symbolTable.moveFirstHalfDownFromAddress(selectedAddress)
			await showAddress(nextAddress)
			await ramSelection.select(selectedAddress, selectedColumn)
			return
		}
		if (e.altKey && isValidAddress(nextAddress)) {
			await ramSelection.deselect()
			ram.swapAddresses(selectedAddress, nextAddress)
			symbolTable.swapAddresses(selectedAddress, nextAddress)
			await showAddress(nextAddress)
			await ramSelection.select(nextAddress, selectedColumn)
			return
		}
		if (isValidAddress(nextAddress)) {
			await showAddress(nextAddress)
			await ramSelection.select(nextAddress, selectedColumn)
			return
		}
	}

	function onEnter(e: KeyboardEvent): void {
		if (ramSelection.noSelection()) {
			ramSelection.select(firstVisibleAddress)
		} else {
			ramSelection.deselect()
		}
	}

	function onClearButtonPressed() {
		ram.clear()
		symbolTable.clear()
	}

	function subscribeRamKeysListener(node: HTMLElement) {
		const keyDownListener = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowUp":
					onArrowUp(e)
					break
				case "ArrowDown":
					onArrowDown(e)
					break
				case "Enter":
					onEnter(e)
					break
			}
		}
		document.addEventListener("keydown", keyDownListener)
		return {
			destroy() {
				document.removeEventListener("keydown", keyDownListener)
			}
		}
	}
</script>

<div
	class="absolute top-[115px] right-[50px] z-[3] flex flex-col items-center justify-center"
	use:subscribeRamKeysListener
>
	<ComponentLabel text="RAM" fontSize="LARGE" top="-30px" right="0" />
	<div class="flex" on:wheel={({ deltaY }) => scroll(deltaY, true)}>
		<div class="flex flex-col items-end justify-center">
			{#each visibleAddresses as address, i (address)}
				<Label
					{symbolTable}
					{address}
					label={$labelsStore[address]}
					isSelected={$ramSelection.address === address && $ramSelection.column === "LABEL"}
					bind:this={labelElements[i]}
					isFirstLabel={address === firstVisibleAddress}
					isLastLabel={address === lastVisibleAddress}
				/>
			{/each}
		</div>
		<div class="h-fit flex flex-col rounded-2xl shadow-cpu">
			{#each visibleAddresses as address, i (address)}
				<div class="flex flex-nowrap">
					<Address
						{address}
						bind:this={addressElements[i]}
						class="
							{address === firstVisibleAddress ? 'first-address' : ''}
							{address === lastVisibleAddress ? 'last-address' : ''}
						"
					/>
					<Cell
						{symbolTable}
						{address}
						instruction={$instructionsStore[address]}
						isSelected={$ramSelection.address === address && $ramSelection.column === "CELL"}
						bind:this={cellElements[i]}
						class="
							{address === firstVisibleAddress ? 'first-cell' : ''}
							{address === lastVisibleAddress ? 'last-cell' : ''}
						"
					/>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex">
		<Button on:click={onClearButtonPressed} title={$text.ram.buttons.clear.title}
			>{$text.ram.buttons.clear.text}</Button
		>
	</div>
</div>
