<script lang="ts">
	import symbolTableStore from "../../store/symbolTableStore"
	import { addressToIndex } from "../../util/ramUtil"
	import { messageFeed } from "../../store/components"
	import ramSelection from "../../store/ramSelection"
	import Logger from "../../util/Logger"

	export let address: number
	export let selected: boolean

	let input: HTMLInputElement

	$: label = $symbolTableStore[addressToIndex(address)]
	$: inputTransition = !label
	$: isExpanded = selected || !!label
	$: selected && input && input.focus()

	function formatInput({ target }) {
		target.value = target.value
			.toUpperCase()
			.replaceAll(/[^A-Z_]/g, "")
			.slice(0, 10)
	}

	function scaleX(node, { delay = 0, duration = 200 }) {
		return {
			delay: 0,
			duration: inputTransition ? duration : 0,
			css: t => {
				if (inputTransition) {
					return `transform: scaleX(${t})`
				} else {
					return ""
				}
			}
		}
	}

	function delay(node, { delay = 0, duration = 0 }) {
		return {
			delay: inputTransition ? delay : 0,
			duration,
			css: t => {
				if (inputTransition) {
					return `filter: opacity(${t})`
				} else {
					return ""
				}
			}
		}
	}

	export function select() {
		ramSelection.select(address, "LABEL")
	}

	export function deselect() {
		commitInput()
		if ($ramSelection.column === "LABEL" && address === $ramSelection.address) {
			ramSelection.deselect()
		}
	}

	export function commitInput() {
		try {
			if (!input) return
			Logger.info(`RamLabel input: "${input.value}"`, "USER_INPUT")
			symbolTableStore.setLabel(address, input.value)
			label = $symbolTableStore[addressToIndex(address)]
		} catch (error) {
			$messageFeed.message("ERROR", error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
		}
	}

	export function getAddress() {
		return address
	}
</script>

<div class="relative h-[30px] flex items-center {$$restProps.class}">
	{#if isExpanded}
		<input
			value={label}
			bind:this={input}
			on:input={formatInput}
			on:focus={select}
			on:focusout={deselect}
			transition:scaleX
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
				bg-gray-500/50
				text-black
				shadow-ramlabels
				rounded-l-md
				origin-right
			"
		/>
	{:else}
		<svg
			on:click={select}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			in:delay={{ delay: 300 }}
			class="absolute right-0 fill-black/30 cursor-pointer w-6 h-6 transition-colors hover:fill-black"
		>
			<rect fill="none" height="24px" width="24px" />
			<path
				d="M21,12l-4.37,6.16C16.26,18.68,15.65,19,15,19h-3l0-2h3l3.55-5L15,7H5v3H3V7c0-1.1,0.9-2,2-2h10c0.65,0,1.26,0.31,1.63,0.84 L21,12z M10,15H7v-3H5v3H2v2h3v3h2v-3h3V15z"
			/>
		</svg>
	{/if}
</div>

<style lang="scss">
	.first-label input {
		border-radius: 5px 10px 0 5px;
	}

	.last-label input {
		border-radius: 5px 0 10px 5px;
	}
</style>
