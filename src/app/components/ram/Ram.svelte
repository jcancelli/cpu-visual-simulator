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
	import { exportProgram, parseProgram } from "../../util/programParser"

	export let ram: Ram
	export let symbolTable: SymbolTable
	export let animationsEnabled: boolean

	const VISIBLE_CELLS = 18

	const instructions = ram.instructions
	const labels = symbolTable.labels

	let beforeUpdateCallbacks: (() => void)[] = []
	let afterUpdateCallbacks: (() => void)[] = []

	let firstVisibleAddress: number = FIRST_ADDRESS
	let lastVisibleAddress: number
	let visibleAddresses: number[]

	let labelElements: Label[] = []
	let addressElements: Address[] = []
	let cellElements: Cell[] = []

	updateVisibleAddresses()

	beforeUpdate(() => {
		beforeUpdateCallbacks.forEach(callback => callback())
		beforeUpdateCallbacks = []
	})

	afterUpdate(() => {
		afterUpdateCallbacks.forEach(callback => callback())
		afterUpdateCallbacks = []
	})

	export function scrollUp(): void {
		scroll(-1, true)
	}

	export function scrollDown(): void {
		scroll(1, true)
	}

	export function addressIsVisible(address: number): boolean {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		return address >= firstVisibleAddress && address <= lastVisibleAddress
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
		updateVisibleAddresses()
		return new Promise<void>((resolve, reject) => {
			afterUpdateCallbacks.push(resolve)
		})
	}

	export async function flashAddress(address: number): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		if (!animationsEnabled) return
		return showAddress(address)
			.then(async () => await tick())
			.then(() => addressElements.find(addressElement => addressElement?.getAddress?.() === address)?.flash())
	}

	export async function flashContent(address: number): Promise<void> {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		if (!animationsEnabled) return
		return showAddress(address)
			.then(async () => await tick())
			.then(() => cellElements.find(cellElement => cellElement?.getAddress?.() === address)?.flash()) // sometimes throws a "cellElement.getAddress() is not a function" error, idk why, therefore the "?." operator. Don't even kwon how to replicate the error
	}

	function scroll(deltaY: number, deselect: boolean): void {
		if (deselect) {
			beforeUpdateCallbacks.push(ramSelection.deselect)
		}
		let newFirstVisibleAddress = firstVisibleAddress + (deltaY > 0 ? WORD_SIZE : -WORD_SIZE)
		if (newFirstVisibleAddress < FIRST_ADDRESS) {
			newFirstVisibleAddress = FIRST_ADDRESS
		}
		if (newFirstVisibleAddress > LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE) {
			newFirstVisibleAddress = LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE
		}
		firstVisibleAddress = newFirstVisibleAddress
		updateVisibleAddresses()
	}

	function onWheel({ deltaY }: WheelEvent): void {
		scroll(deltaY, true)
	}

	function onArrowUp(e: KeyboardEvent): void {
		if (ramSelection.noSelection()) {
			return
		}
		if (e.ctrlKey) {
			ram.moveSecondHalfUpFromAddress($ramSelection.address)
			symbolTable.moveSecondHalfUpFromAddress($ramSelection.address)
			return
		}
		if (e.shiftKey) {
			ram.moveFirstHalfUpFromAddress($ramSelection.address)
			symbolTable.moveFirstHalfUpFromAddress($ramSelection.address)
			return
		}
		if ($ramSelection.address === firstVisibleAddress) {
			scroll(-1, false)
		}
		ramSelection.selectUp()
	}

	function onArrowDown(e: KeyboardEvent): void {
		if (ramSelection.noSelection()) {
			return
		}
		if (e.ctrlKey) {
			ram.moveSecondHalfDownFromAddress($ramSelection.address)
			symbolTable.moveSecondHalfDownFromAddress($ramSelection.address)
			return
		}
		if (e.shiftKey) {
			ram.moveFirstHalfDownFromAddress($ramSelection.address)
			symbolTable.moveFirstHalfDownFromAddress($ramSelection.address)
			return
		}
		if ($ramSelection.address === lastVisibleAddress) {
			scroll(1, false)
		}
		ramSelection.selectDown()
	}

	function onEnter(e: KeyboardEvent): void {
		if (ramSelection.noSelection()) {
			ramSelection.select(firstVisibleAddress)
		} else {
			ramSelection.deselect()
		}
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

	function updateVisibleAddresses(): void {
		lastVisibleAddress = firstVisibleAddress + (VISIBLE_CELLS - 1) * WORD_SIZE
		visibleAddresses = []
		for (let i = firstVisibleAddress, j = 0; i <= lastVisibleAddress; i += WORD_SIZE, j++) {
			visibleAddresses[j] = i
		}
	}

	function clear() {
		ram.clear()
		symbolTable.clear()
	}
</script>

<div
	class="absolute top-[115px] right-[50px] z-[3] flex flex-col items-center justify-center"
	use:subscribeRamKeysListener
>
	<ComponentLabel text="RAM" fontSize="LARGE" top="-30px" right="0" />
	<div class="flex" on:wheel={onWheel}>
		<div class="flex flex-col items-end justify-center">
			{#each visibleAddresses as address, i (address)}
				<Label
					{symbolTable}
					{address}
					label={$labels[address]}
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
						instruction={$instructions[address]}
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
		<Button on:click={clear} title={$text.ram.buttons.clear.title}>{$text.ram.buttons.clear.text}</Button>
	</div>
</div>
