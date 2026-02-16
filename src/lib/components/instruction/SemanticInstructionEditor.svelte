<script lang="ts">
	import { i8, I8_MAX, I8_MIN, u8, U8_MAX, U8_MIN } from "$lib/integer"
	import { getImmediateFlag, setImmediateFlag, OPCODES, OPCODES_BY_NUMBER } from "$lib/opcode"

	interface SemanticInstructionEditorProps {
		msb?: number
		lsb?: number
		opcodeClass?: string
		immediateFlagClass?: string
		immediateFlagTrueClass?: string
		immediateFlagFalseClass?: string
		operandClass?: string
	}

	let {
		msb = $bindable(0),
		lsb = $bindable(0),
		opcodeClass = "",
		immediateFlagClass = "",
		immediateFlagTrueClass = "",
		immediateFlagFalseClass = "",
		operandClass = "",
	}: SemanticInstructionEditorProps = $props()

	const msbNoImmediateFlag = $derived(setImmediateFlag(msb, false))
	const opcode = $derived(OPCODES_BY_NUMBER[msbNoImmediateFlag] ?? null)
	const immediateFlag = $derived(getImmediateFlag(msb))
	const operand = $derived(immediateFlag ? i8(lsb) : u8(lsb))

	/** Wether or not the operand input has focus */
	let isEditingOperand = $state(false)
	/** The value that is being edited by the operand input */
	let operandInput = $state(immediateFlag ? i8(lsb) : u8(lsb))
	/** The value that should be displayed by the operand input */
	let operandDisplay = $derived(isEditingOperand ? operandInput : operand)
</script>

<!-- Opcode -->
<select
	bind:value={
		() => msbNoImmediateFlag,
		input => {
			if (input === null) {
				input = msbNoImmediateFlag
			}
			msb = setImmediateFlag(input, immediateFlag)
			return msbNoImmediateFlag
		}
	}
	class={opcodeClass}
>
	{#each OPCODES as opcode (opcode.numeric)}
		<option value={opcode.numeric} selected={msbNoImmediateFlag === opcode.numeric}>
			{opcode.symbolic}
		</option>
	{/each}
	{#if opcode === null}
		<!-- TODO: Translate INVALID -->
		<option value={msbNoImmediateFlag} selected>INVALID</option>
	{/if}
</select>

<!-- Immediate flag -->
<button
	onclick={() => (msb = setImmediateFlag(msbNoImmediateFlag, !immediateFlag))}
	class="{immediateFlagClass} {immediateFlag ? immediateFlagTrueClass : immediateFlagFalseClass}"
>
	#
</button>

<!-- Operand -->
<input
	type="number"
	bind:value={
		() => operandDisplay,
		input => {
			operandInput = input
			if (immediateFlag) {
				if (input > I8_MAX) {
					lsb = u8(I8_MAX)
				} else if (input < I8_MIN) {
					lsb = u8(I8_MIN)
				} else {
					lsb = u8(input ?? 0)
				}
			} else {
				if (input > U8_MAX) {
					lsb = U8_MAX
				} else if (input < U8_MIN) {
					lsb = U8_MIN
				} else {
					lsb = input ?? 0
				}
			}
			return input
		}
	}
	onfocus={() => {
		operandInput = immediateFlag ? i8(lsb) : u8(lsb)
		isEditingOperand = true
	}}
	onblur={() => (isEditingOperand = false)}
	class={operandClass}
/>
