<script lang="ts">
	import { accumulator } from "../../store/cpu"
	import ComponentLabel from "../labels/Component.svelte"
	import { flash as flashElement } from "../../util/animationUtil"
	import { displayAsBinary } from "../../store/settings"
	import BinaryValue from "../../util/BinaryValue"
	import Logger from "../../util/logger"
	import { isValidAddress } from "../../util/ramUtil"
	import CheckedError from "../../errors/CheckedError"
	import { messageFeed } from "../../store/components"
	import lang from "../../store/lang"

	let element: HTMLDivElement
	let isEditing = false
	let inputValue: string

	$: onAccumulatorChange($accumulator)
	$: onDisplayAsBinaryChange($displayAsBinary)

	syncInputValue()

	export async function flash(): Promise<void> {
		return flashElement(element, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	function commitEdit(): void {
		try {
			Logger.info(`Accumulator input: "${inputValue}"`, "USER_INPUT")
			if (inputValue === "") {
				syncInputValue()
				isEditing = false
				return
			}
			let newValue: BinaryValue
			try {
				if ($displayAsBinary) {
					newValue = new BinaryValue(16, inputValue)
				} else {
					newValue = new BinaryValue(16, parseInt(inputValue))
				}
				accumulator.set(newValue)
			} catch (error) {
				throw new CheckedError($lang.errors.user_input.invalid_acc_value)
			}
		} catch (error) {
			$messageFeed?.error(error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
			syncInputValue()
		} finally {
			isEditing = false
		}
	}

	function onAccumulatorChange(newValue: BinaryValue): void {
		syncInputValue()
	}

	function onDisplayAsBinaryChange(newValue: boolean): void {
		syncInputValue()
	}

	function syncInputValue() {
		inputValue = $displayAsBinary ? $accumulator.toBinaryString() : $accumulator.signed().toString()
	}

	function formatInput() {
		inputValue = $displayAsBinary
			? inputValue.replace(/[^10]/g, "").slice(0, 16)
			: inputValue.replace(/[^\d\-]/g, "").slice(0, 6)
	}

	function focus(node: HTMLElement): void {
		node.focus()
	}

	function highlightText(node: HTMLInputElement): void {
		node.select()
	}
</script>

<div
	class="
		absolute
		top-[550px]
		left-[275px]
		w-[170px]
		h-[30px]
		border
		border-black
		rounded-md
		bg-gray-100
		shadow-component
		flex
		items-center
		justify-center
	"
	bind:this={element}
	on:click={() => (isEditing = true)}
>
	<ComponentLabel text="ACC" top="-25px" left="0" />
	{#if isEditing}
		<input
			type="text"
			class="
				w-[170px]
				h-[30px]
				rounded-md
				bg-black
				text-gray-200
				text-center
				leading-[30px]
				selection:bg-transparent
			"
			use:focus
			use:highlightText
			bind:value={inputValue}
			on:input={formatInput}
			on:focusout={commitEdit}
		/>
	{:else}
		{$displayAsBinary ? $accumulator.toBinaryString() : $accumulator.signed()}
	{/if}
</div>
