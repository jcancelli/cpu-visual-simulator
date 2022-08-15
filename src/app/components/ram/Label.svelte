<script lang="ts">
	import type { TransitionConfig } from "svelte/types/runtime/transition"
	import { fade as svelteFade } from "svelte/transition"
	import { messageFeed } from "../../store/components"
	import ramSelection from "../../store/ramSelection"
	import Logger from "../../util/logger"
	import symbolTable from "../../store/symbolTable"
	import { onMount } from "svelte"

	export let address: number
	export let label: string
	export let isSelected: boolean

	let inputValue: string

	let delayButtonTransition: boolean // set to false by onAddressChange, set to true by the button animation. should be false only just after scroll. initialized to true by onMount

	onMount(() => {
		delayButtonTransition = true
	})

	$: onLabelChange(label)
	$: onAddressChange(address)
	$: onSelectedChange(isSelected)

	function commitEdit(): void {
		try {
			Logger.info(`RamLabel input: "${inputValue}"`, "USER_INPUT")
			symbolTable.setLabel(address, inputValue)
		} catch (error) {
			$messageFeed?.error(error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
			inputValue = label
		} finally {
			deselect()
		}
	}

	function select(): void {
		ramSelection.select(address, "LABEL")
	}

	function deselect(): void {
		if (ramSelection.isSelected(address, "LABEL")) {
			ramSelection.deselect()
		}
	}

	function onAddressChange(newAddress: number): void {
		delayButtonTransition = false
		inputValue = label
	}

	function onLabelChange(newLabel: string): void {
		inputValue = label
	}

	function onSelectedChange(isNowSelected: boolean): void {
		if (isNowSelected) {
			inputValue = label
		}
	}

	function formatInput(): void {
		inputValue = inputValue
			.toUpperCase()
			.replace(/[^A-Z_]/g, "")
			.slice(0, 10)
	}

	function focus(node: HTMLElement): void {
		node.focus()
	}

	function scaleX(node: HTMLElement, { condition = () => true }): TransitionConfig {
		return {
			delay: 0,
			duration: condition() ? 200 : 0,
			css: t => `transform: scaleX(${t})`
		}
	}

	function delay(node: HTMLElement, { condition = () => true }): TransitionConfig {
		return condition() ? svelteFade(node, { delay: 150 }) : null
	}
</script>

<div class="relative h-[30px] flex items-center {$$restProps.class}">
	{#if isSelected}
		<input
			bind:value={inputValue}
			on:input={formatInput}
			on:focusout={commitEdit}
			use:focus
			in:scaleX={{ condition: () => !$symbolTable[address] }}
			out:scaleX={{ condition: () => !$symbolTable[address] }}
			class="
				absolute
				right-0
				h-[28px]
				w-[150px]
				p-[10px]
				border
				border-black/40
				border-r-0
				outline-none
				bg-gray-500/60
				text-black
				shadow-ramlabels
				rounded-l-md
				origin-right
			"
		/>
	{:else if label}
		<div
			on:input={formatInput}
			on:click={select}
			class="
				absolute
				right-0
				h-[28px]
				w-[150px]
				flex
				items-center
				justify-start
				p-[10px]
				border
				border-black/40
				border-r-0
				outline-none
				bg-gray-500/60
				text-black
				shadow-ramlabels
				rounded-l-md
				origin-right
				cursor-text
			"
		>
			{$symbolTable[address]} :
		</div>
	{:else}
		<button
			on:click={select}
			in:delay={{
				condition: () => {
					const tmp = delayButtonTransition
					delayButtonTransition = true
					return !isSelected && tmp
				}
			}}
			class="absolute right-0 cursor-pointer w-6 h-6"
		>
			<svg class="fill-black/30 w-6 h-6 transition-colors hover:fill-black">
				<rect class="fill-transparent h-6 w-6" />
				<path
					d="M21,12l-4.37,6.16C16.26,18.68,15.65,19,15,19h-3l0-2h3l3.55-5L15,7H5v3H3V7c0-1.1,0.9-2,2-2h10c0.65,0,1.26,0.31,1.63,0.84 L21,12z M10,15H7v-3H5v3H2v2h3v3h2v-3h3V15z"
				/>
			</svg>
		</button>
	{/if}
</div>

<style>
	.first-label input {
		border-radius: 5px 10px 0 5px;
	}

	.last-label input {
		border-radius: 5px 0 10px 5px;
	}
</style>
