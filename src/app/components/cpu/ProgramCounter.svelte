<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash as flashElement } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import BinaryValue from "../../model/BinaryValue"
	import Logger from "../../util/logger"
	import { isValidAddress } from "../../util/ram"
	import CheckedError from "../../errors/CheckedError"
	import { messageFeedStore } from "../../store/state"
	import text from "../../store/text"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let element: HTMLDivElement
	let isEditing = false
	let inputValue: string

	const programCounter = cpu.programCounter

	$: onProgramCounterChange($programCounter)
	$: onDisplayAsBinaryChange($displayAsBinary)

	syncInputValue()

	export async function flash(): Promise<void> {
		if (!animationsEnabled) return
		return flashElement(element, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	function commitEdit(): void {
		try {
			Logger.info(`ProgramCounter input: "${inputValue}"`, "USER_INPUT")
			if (inputValue === "") {
				syncInputValue()
				isEditing = false
				return
			}
			let newValue: BinaryValue
			try {
				if ($displayAsBinary) {
					newValue = new BinaryValue(8, inputValue)
				} else {
					newValue = new BinaryValue(8, parseInt(inputValue))
				}
			} catch (error) {
				throw new CheckedError($text.errors.user_input.invalid_pc_value)
			}
			if (!isValidAddress(newValue.unsigned())) {
				throw new CheckedError($text.errors.user_input.invalid_pc_value)
			}
			programCounter.set(newValue)
		} catch (error) {
			$messageFeedStore?.error(error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
			syncInputValue()
		} finally {
			isEditing = false
		}
	}

	function onProgramCounterChange(newValue: BinaryValue): void {
		syncInputValue()
	}

	function onDisplayAsBinaryChange(newValue: boolean): void {
		syncInputValue()
	}

	function syncInputValue() {
		inputValue = $displayAsBinary ? $programCounter.toBinaryString() : $programCounter.unsigned().toString()
	}

	function formatInput() {
		inputValue = $displayAsBinary
			? inputValue.replace(/[^10]/g, "").slice(0, 8)
			: inputValue.replace(/\D/g, "").slice(0, 3)
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
	top-[70px]
	left-[570px]
	w-[100px]
	h-[30px]
	leading-[30px]
	text-center
	border
	border-black
	rounded-md
	bg-gray-100
	shadow-component
	cursor-text
	font-mono
"
	bind:this={element}
	on:click={() => (isEditing = true)}
>
	<ComponentLabel text="PC" top="-25px" left="0" />
	{#if isEditing}
		<input
			type="text"
			class="
				w-[100px]
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
		{$displayAsBinary ? $programCounter.toBinaryString() : $programCounter.unsigned()}
	{/if}
</div>
