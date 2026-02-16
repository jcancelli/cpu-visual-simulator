<script lang="ts">
	import { u8, U8_MAX, U8_MIN } from "$lib/integer"

	interface InstructionUnsignedEditorProps {
		msb?: number
		lsb?: number
		msbClass?: string
		lsbClass?: string
	}

	let {
		msb = $bindable(0),
		lsb = $bindable(0),
		msbClass = "",
		lsbClass = "",
	}: InstructionUnsignedEditorProps = $props()

	/** Ensures msb is casted to u8 */
	let u8Msb = $derived(u8(msb))
	/** Ensures lsb is casted to u8 */
	let u8Lsb = $derived(u8(lsb))
	/** Wether one of the input is focused or not */
	let isEditing = $state(false)
	/** The value that is being edited by the input */
	let msbInputValue = $state(u8Msb)
	/** The value that should be displayed by the input */
	let msbDisplayValue = $derived(isEditing ? msbInputValue : u8Msb)
	/** The value that is being edited by the input */
	let lsbInputValue = $state(u8Lsb)
	/** The value that should be displayed by the input */
	let lsbDisplayValue = $derived(isEditing ? lsbInputValue : u8Lsb)
</script>

<input
	type="number"
	step={1}
	bind:value={
		() => msbDisplayValue,
		input => {
			msbInputValue = input
			if (input > U8_MAX) {
				msb = U8_MAX
			} else if (input < U8_MIN) {
				msb = U8_MIN
			} else {
				msb = input ?? 0
			}
			return msbInputValue
		}
	}
	onfocus={() => {
		msbInputValue = u8Msb
		isEditing = true
	}}
	onblur={() => {
		isEditing = false
	}}
	class={msbClass}
/>
<input
	type="number"
	step={1}
	bind:value={
		() => lsbDisplayValue,
		input => {
			lsbInputValue = input
			if (input > U8_MAX) {
				lsb = U8_MAX
			} else if (input < U8_MIN) {
				lsb = U8_MIN
			} else {
				lsb = input ?? 0
			}
			return lsbInputValue
		}
	}
	onfocus={() => {
		lsbInputValue = lsb
		isEditing = true
	}}
	onblur={() => {
		isEditing = false
	}}
	class={lsbClass}
/>
