<script lang="ts">
	import { u8 } from "$lib/integer"

	interface InstructionBinaryEditorProps {
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
	}: InstructionBinaryEditorProps = $props()

	/** Wether or not one of the input has focus */
	let isEditing = $state(false)
	/** Contains the actual value of the msb, correctly formatted and padded with 0 to length 8 */
	let msbFormattedStr = $derived(u8(msb).toString(2).padStart(8, "0"))
	/** The string that is currently being edited by the input */
	let msbInputStr = $state(u8(msb).toString(2).padStart(8, "0"))
	/** The string that should be displayed by the input */
	let msbDisplayStr = $derived(isEditing ? msbInputStr : msbFormattedStr)
	/** Contains the actual value of the lsb, correctly formatted and padded with 0 to length 8 */
	let lsbFormattedStr = $derived(u8(lsb).toString(2).padStart(8, "0"))
	/** The string that is currently being edited by the input */
	let lsbInputStr = $state(u8(lsb).toString(2).padStart(8, "0"))
	/** The string that should be displayed by the input */
	let lsbDisplayStr = $derived(isEditing ? lsbInputStr : lsbFormattedStr)
</script>

<input
	type="text"
	maxlength={8}
	bind:value={
		() => msbDisplayStr,
		value => {
			msbInputStr = value.replaceAll(/[^01]/g, "")
			if (msbInputStr !== "") {
				msb = u8(parseInt(msbInputStr, 2))
			} else {
				msb = 0
			}
			return msbInputStr
		}
	}
	onfocus={() => (isEditing = true)}
	onblur={() => {
		msbInputStr = msbFormattedStr
		isEditing = false
	}}
	class={msbClass}
/>
<input
	type="text"
	maxlength={8}
	bind:value={
		() => lsbDisplayStr,
		value => {
			lsbInputStr = value.replaceAll(/[^01]/g, "")
			if (lsbInputStr !== "") {
				lsb = u8(parseInt(lsbInputStr, 2))
			} else {
				lsb = 0
			}
			return lsbInputStr
		}
	}
	onfocus={() => (isEditing = true)}
	onblur={() => {
		lsbInputStr = lsbFormattedStr
		isEditing = false
	}}
	class={lsbClass}
/>
