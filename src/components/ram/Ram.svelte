<script lang="ts">
	import { isValidAddress, FIRST_ADDRESS, LAST_ADDRESS, WORD_SIZE } from "../../util/ramUtil"
	import RamLabel from "./RamLabel.svelte"
	import RamAddress from "./RamAddress.svelte"
	import RamCell from "./RamCell.svelte"
	import ComponentLabel from "../ComponentLabel.svelte"
	import ramStore from "../../store/ramStore"
	import ramSelectionStore from "../../store/ramSelectionStore"

	const VISIBLE_CELLS = 18

	let firstVisibleAddress = FIRST_ADDRESS
	$: lastVisibleAddress = firstVisibleAddress + (VISIBLE_CELLS - 1) * WORD_SIZE
	let visibleAddresses: number[] = []
	$: {
		visibleAddresses = []
		for (let i = firstVisibleAddress, j = 0; i <= lastVisibleAddress; i += WORD_SIZE, j++) {
			visibleAddresses[j] = i
		}
	}

	let labelElements: RamLabel[] = []
	let addressElements: RamAddress[] = []
	let cellElements: RamCell[] = []

	function scroll({ deltaY }) {
		let newFirstVisibleAddress = firstVisibleAddress + (deltaY > 0 ? WORD_SIZE : -WORD_SIZE)
		if (newFirstVisibleAddress < FIRST_ADDRESS)
			newFirstVisibleAddress = LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE
		if (newFirstVisibleAddress > LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE)
			newFirstVisibleAddress = FIRST_ADDRESS
		firstVisibleAddress = newFirstVisibleAddress
	}

	function onWheel({ deltaY }) {
		ramSelectionStore.deselect()
		scroll({ deltaY })
	}

	function onArrowUp(e: KeyboardEvent) {
		if (ramSelectionStore.noSelection()) return
		if (e.ctrlKey) {
			ramStore.moveSecondHalfUpFromAddress($ramSelectionStore.address)
		} else if (e.shiftKey) {
			ramStore.moveFirstHalfUpFromAddress($ramSelectionStore.address)
		}
		if ($ramSelectionStore.address === firstVisibleAddress) {
			scrollUp()
		}
		ramSelectionStore.selectUp()
	}

	function onArrowDown(e: KeyboardEvent) {
		if (ramSelectionStore.noSelection()) return
		if (e.ctrlKey) {
			ramStore.moveSecondHalfDownFromAddress($ramSelectionStore.address)
		} else if (e.shiftKey) {
			ramStore.moveFirstHalfDownFromAddress($ramSelectionStore.address)
		}
		if ($ramSelectionStore.address === lastVisibleAddress) {
			scrollDown()
		}
		ramSelectionStore.selectDown()
	}

	function onArrowLeft(e: KeyboardEvent) {
		if (ramSelectionStore.noSelection()) return
		ramSelectionStore.selectLeft()
	}

	function onArrowRight(e: KeyboardEvent) {
		if (ramSelectionStore.noSelection()) return
		ramSelectionStore.selectRight()
	}

	function onEnter(e: KeyboardEvent) {
		if (ramSelectionStore.noSelection()) {
			ramSelectionStore.select(firstVisibleAddress)
		} else {
			ramSelectionStore.deselect()
		}
	}

	function ramKeysListener(node) {
		const keyDownListener = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowUp":
					onArrowUp(e)
					break
				case "ArrowDown":
					onArrowDown(e)
					break
				case "ArrowLeft":
					onArrowLeft(e)
					break
				case "ArrowRight":
					onArrowRight(e)
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

	export function scrollUp() {
		scroll({ deltaY: -1 })
	}

	export function scrollDown() {
		scroll({ deltaY: 1 })
	}

	export function addressIsVisible(address: number): boolean {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		return address >= firstVisibleAddress && address <= lastVisibleAddress
	}

	export function showAddress(address: number): void {
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
	}

	export async function flashAddress(address: number) {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		showAddress(address)
		return addressElements.find(e => e.getAddress() === address).flash()
	}

	export async function flashContent(address: number) {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		showAddress(address)
		return cellElements.find(e => e.getAddress() === address).flash()
	}
</script>

<div class="ram-wrapper" on:wheel={onWheel} use:ramKeysListener>
	<ComponentLabel text="RAM" fontSize="LARGE" top="-30px" right="0" />

	<div class="labels">
		{#each visibleAddresses as address, i}
			<RamLabel
				{address}
				selected={$ramSelectionStore.address === address && $ramSelectionStore.column === "LABEL"}
				bind:this={labelElements[i]}
			/>
		{/each}
	</div>

	<div class="ram">
		{#each visibleAddresses as address, i}
			<div class="row">
				<RamAddress {address} bind:this={addressElements[i]} />
				<RamCell
					{address}
					selected={$ramSelectionStore.address === address && $ramSelectionStore.column === "CELL"}
					bind:this={cellElements[i]}
				/>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@import "../../style/variables.scss";

	.ram-wrapper {
		position: absolute;
		right: 50px;
		top: 115px;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.labels {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
	}

	.ram {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 20px rgba(#000000, 0.3);
		border-radius: 15px;
		background-color: rgba(#000000, 0.3);

		.row {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			align-items: center;
		}
	}
</style>
