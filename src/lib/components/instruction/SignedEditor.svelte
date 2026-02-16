<script lang="ts">
	import { i8, u8, I8_MAX, I8_MIN } from "$lib/integer"

	interface InstructionSignedEditorProps {
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
	}: InstructionSignedEditorProps = $props()

	/** Ensures msb is casted to i8 */
	let i8Msb = $derived(i8(msb))
	/** Ensures lsb is casted to i8 */
	let i8Lsb = $derived(i8(lsb))
	/** Wether one of the input is focused or not */
	let isEditing = $state(false)
	/** The value that is being edited by the input */
	let msbInputValue = $state(i8Msb)
	/** The value that should be displayyed by the input */
	let msbDisplayValue = $derived(isEditing ? msbInputValue : i8Msb)
	/** The value that is being edited by the input */
	let lsbInputValue = $state(i8Lsb)
	/** The value that should be displayyed by the input */
	let lsbDisplayValue = $derived(isEditing ? lsbInputValue : i8Lsb)
</script>

<input
	type="number"
	step={1}
	bind:value={
		() => msbDisplayValue,
		input => {
			msbInputValue = input
			if (input > I8_MAX) {
				msb = u8(I8_MAX)
			} else if (input < I8_MIN) {
				msb = u8(I8_MIN)
			} else {
				msb = u8(input ?? 0)
			}
			return msbInputValue
		}
	}
	onfocus={() => {
		msbInputValue = i8Msb
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
			if (input > I8_MAX) {
				lsb = u8(I8_MAX)
			} else if (input < I8_MIN) {
				lsb = u8(I8_MIN)
			} else {
				lsb = u8(input ?? 0)
			}
			return lsbInputValue
		}
	}
	onfocus={() => {
		lsbInputValue = i8Lsb
		isEditing = true
	}}
	onblur={() => {
		isEditing = false
	}}
	class={lsbClass}
/>
