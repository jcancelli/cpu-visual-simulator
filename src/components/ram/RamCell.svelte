<script lang="ts">
	import ramStore from "../../store/ramStore"
	import { parse } from "../../instruction/instructionParser"
	import { addressToIndex } from "../../util/ramUtil"
	import { messageFeed } from "../../store/components"
	import { flash as flashComponent } from "../../util/animationUtil"
	import ramSelection from "../../store/ramSelection"
	import Logger from "../../util/Logger"
	import { displayAsBinary } from "../../store/settings"

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
		ramSelection.select(address, "CELL")
	}

	export function deselect() {
		commitInput()
		if ($ramSelection.column === "CELL" && address === $ramSelection.address) {
			ramSelection.deselect()
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

	export async function flash() {
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

<div
	class="
		h-[30px]
		w-[190px]
		grid
		grid-cols-2
		items-center
		bg-gray-200
		cursor-text
		border
		border-black
		border-t-0
		border-l-0
		{$$restProps.class}
	"
	on:click={select}
	bind:this={cell}
>
	{#if selected}
		<input
			value={opcode + (operand ? " " + operand : "")}
			bind:this={input}
			use:initInput
			on:focusout={deselect}
			on:input={formatInput}
			class="
				h-[30px]
				w-[190px]
				p-0
				pl-[10px]
				border-0
				col-span-1
				outline-none
				bg-black
				text-gray-200
				selection:bg-transparent
			"
		/>
	{:else}
		<div class="h-[30px] w-[190px] flex items-center justify-start pl-[10px]">{opcode}</div>
		{#if operand}
			<div class="h-[30px] w-[190px] flex items-center justify-start overflow-hidden">
				{operand}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.first-cell {
		border-radius: 0 10px 0 0;
		border-top: thin solid black;

		input {
			border-radius: 0 10px 0 0;
		}
	}

	.last-cell {
		border-radius: 0 0 10px 0;

		input {
			border-radius: 0 0 10px 0;
		}
	}
</style>
