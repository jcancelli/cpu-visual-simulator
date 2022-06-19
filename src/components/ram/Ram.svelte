<script lang="ts">
	import { isValidAddress, FIRST_ADDRESS, LAST_ADDRESS, WORD_SIZE } from "../../util/ramUtil"
	import RamLabel from "./RamLabel.svelte"
	import RamAddress from "./RamAddress.svelte"
	import RamCell from "./RamCell.svelte"
	import ComponentLabel from "../ComponentLabel.svelte"
	import ramStore from "../../store/ramStore"
	import ramSelection from "../../store/ramSelection"
	import { afterUpdate } from "svelte"

	const VISIBLE_CELLS = 18

	let afterUpdateCallbacks: (() => void)[] = []

	let firstVisibleAddress = FIRST_ADDRESS
	let lastVisibleAddress: number
	let visibleAddresses: number[]

	updateVisibleAddresses()

	let labelElements: RamLabel[] = []
	let addressElements: RamAddress[] = []
	let cellElements: RamCell[] = []

	afterUpdate(() => {
		afterUpdateCallbacks.forEach(callback => callback())
		afterUpdateCallbacks = []
	})

	function scroll({ deltaY }) {
		let newFirstVisibleAddress = firstVisibleAddress + (deltaY > 0 ? WORD_SIZE : -WORD_SIZE)
		if (newFirstVisibleAddress < FIRST_ADDRESS)
			newFirstVisibleAddress = LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE
		if (newFirstVisibleAddress > LAST_ADDRESS - (VISIBLE_CELLS - 1) * WORD_SIZE)
			newFirstVisibleAddress = FIRST_ADDRESS
		firstVisibleAddress = newFirstVisibleAddress
		updateVisibleAddresses()
	}

	function onWheel({ deltaY }) {
		ramSelection.deselect()
		scroll({ deltaY })
	}

	function onArrowUp(e: KeyboardEvent) {
		if (ramSelection.noSelection()) return
		if (e.ctrlKey) {
			ramStore.moveSecondHalfUpFromAddress($ramSelection.address)
		} else if (e.shiftKey) {
			ramStore.moveFirstHalfUpFromAddress($ramSelection.address)
		}
		if ($ramSelection.address === firstVisibleAddress) {
			scrollUp()
		}
		ramSelection.selectUp()
	}

	function onArrowDown(e: KeyboardEvent) {
		if (ramSelection.noSelection()) return
		if (e.ctrlKey) {
			ramStore.moveSecondHalfDownFromAddress($ramSelection.address)
		} else if (e.shiftKey) {
			ramStore.moveFirstHalfDownFromAddress($ramSelection.address)
		}
		if ($ramSelection.address === lastVisibleAddress) {
			scrollDown()
		}
		ramSelection.selectDown()
	}

	function onEnter(e: KeyboardEvent) {
		if (ramSelection.noSelection()) {
			ramSelection.select(firstVisibleAddress)
		} else {
			ramSelection.deselect()
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

	function updateVisibleAddresses() {
		lastVisibleAddress = firstVisibleAddress + (VISIBLE_CELLS - 1) * WORD_SIZE
		visibleAddresses = []
		for (let i = firstVisibleAddress, j = 0; i <= lastVisibleAddress; i += WORD_SIZE, j++) {
			visibleAddresses[j] = i
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

	export async function showAddress(address: number) {
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

	export async function flashAddress(address: number) {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		return showAddress(address).then(() =>
			addressElements.find(e => e.getAddress() === address).flash()
		)
	}

	export async function flashContent(address: number) {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address")
		}
		return showAddress(address).then(() =>
			cellElements.find(e => e.getAddress() === address).flash()
		)
	}
</script>

<div class="ram-wrapper" on:wheel={onWheel} use:ramKeysListener>
	<ComponentLabel text="RAM" fontSize="LARGE" top="-30px" right="0" />

	<div class="labels">
		{#each visibleAddresses as address, i}
			<RamLabel
				{address}
				selected={$ramSelection.address === address && $ramSelection.column === "LABEL"}
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
					selected={$ramSelection.address === address && $ramSelection.column === "CELL"}
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
