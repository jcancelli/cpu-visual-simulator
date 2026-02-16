<script lang="ts">
	import { i16LSB, i16MSB, joinU8ToI16, u8 } from "$lib/integer"

	interface SignedWordInstructionEditorProps {
		msb?: number
		lsb?: number
		class?: string
	}

	let {
		msb = $bindable(0),
		lsb = $bindable(0),
		...props
	}: SignedWordInstructionEditorProps = $props()

	let value = $derived(joinU8ToI16(u8(msb), u8(lsb)))
	/** Wether one of the input is focused or not */
	let isEditing = $state(false)
	/** The value that is being edited by the input */
	let inputValue = $state(value)
	/** The value that should be displayed by the input */
	let displayValue = $derived(isEditing ? inputValue : value)
</script>

<input
	type="number"
	step={1}
	bind:value={
		() => displayValue,
		input => {
			inputValue = input
			msb = i16MSB(input ?? 0)
			lsb = i16LSB(input ?? 0)
			return inputValue
		}
	}
	onfocus={() => {
		inputValue = joinU8ToI16(msb, lsb)
		isEditing = true
	}}
	onblur={() => {
		isEditing = false
	}}
	class={props.class ?? ""}
/>
