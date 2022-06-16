<script lang="ts">
	import ramStore from "../../store/ramStore"
	import { parse } from "../../instruction/instructionParser"
	import { addressToIndex } from "../../util/ramUtil"
	import { messageFeed } from "../../store/componentsStore"
	import { flash as flashComponent } from "../../util/animationUtil"
	import ramSelectionStore from "../../store/ramSelectionStore"
	import Logger from "../../util/Logger"
	import { displayAsBinary } from "../../store/settingsStores"

	export let address: number
	export let selected: boolean = false

	let cell: HTMLDivElement
	let input: HTMLInputElement

	$: instruction = $ramStore[addressToIndex(address)]
	$: opcode = $displayAsBinary ? instruction.binaryOpcode() : instruction.symbolicOpcode
	$: operand = $displayAsBinary ? instruction.binaryOperand() : instruction.symbolicOperand

	function formatInput({ target }) {
		target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9 _\-#\(\)]*/g, "")
	}

	function initInput(element) {
		element.value = opcode + (operand ? ` ${operand}` : "")
		element.focus()
		setTimeout(() => element.select())
	}

	export function select() {
		ramSelectionStore.select(address, "CELL")
	}

	export function deselect() {
		commitInput()
		if ($ramSelectionStore.column === "CELL" && address === $ramSelectionStore.address) {
			ramSelectionStore.deselect()
		}
	}

	export function commitInput() {
		try {
			if (input && input.value !== "") {
				Logger.info(`RamCell input: "${input.value}"`, "USER_INPUT")
				ramStore.write(address, parse(input.value.trim(), $displayAsBinary))
			}
		} catch (error) {
			$messageFeed.message("ERROR", error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
		}
	}

	export function flash() {
		return flashComponent(
			cell,
			"background-color",
			{ r: 211, g: 211, b: 211 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	export function getAddress() {
		return address
	}
</script>

<div class="cell" on:click={select} bind:this={cell}>
	{#if selected}
		<input
			value={opcode + (operand ? " " + operand : "")}
			bind:this={input}
			use:initInput
			on:focusout={deselect}
			on:input={formatInput}
		/>
	{:else}
		<div class="opcode">{opcode}</div>
		{#if operand}
			<div class="operand">{operand}</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	@import "../../style/variables.scss";

	.cell {
		height: $ram-cell-height;
		width: $ram-cell-width;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		font-size: $ram-font-size;
		background-color: lightgrey;
		cursor: text;
		border: thin solid black;
		border-top: 0;
		border-left: 0;
	}

	:global(.row:first-child .cell) {
		border-radius: 0 10px 0 0;
		border-top: thin solid black;

		input {
			border-radius: 0 10px 0 0;
		}
	}

	:global(.row:last-child .cell) {
		border-radius: 0 0 10px 0;

		input {
			border-radius: 0 0 10px 0;
		}
	}

	input {
		display: block;
		width: $ram-cell-width;
		height: $ram-cell-height;
		padding: 0;
		padding-left: $ram-cell-padding-left;
		border: 0;
		grid-column: 1 / -1;
		outline: 0;
		box-sizing: border-box;
		background-color: black;
		color: lightgrey;
		font-size: $ram-font-size;
		font-stretch: normal;
	}

	.opcode,
	.operand {
		height: $ram-cell-height;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		font-size: $ram-font-size;
	}

	.opcode {
		width: $ram-opcode-width;
		padding-left: $ram-cell-padding-left;
	}

	.operand {
		width: $ram-operand-width;
		overflow: hidden;
	}

	input::selection {
		background-color: transparent;
	}
</style>
