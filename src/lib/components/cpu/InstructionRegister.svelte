<script lang="ts">
	import type { WordRegister } from "$lib/register/register.svelte"
	import { Base, i8, u8ToPaddedString } from "$lib/types/integer"
	import { getImmediateFlag, getOpcodeByNumeric } from "$lib/types/opcode"

	export interface InstructionRegisterProps {
		register: WordRegister
		base?: Base
		id?: string
		class?: string
	}

	let { register, base = Base.DECIMAL, id, ...props }: InstructionRegisterProps = $props()

	const opcode = $derived(getOpcodeByNumeric(register.msb))
	const immediateFlag = $derived(getImmediateFlag(register.msb))
</script>

<div
	{id}
	class="
		instruction-register
		register
		register-foreground
		register-background
		register-border
		grid
		w-(--instruction-register-width)
		grid-cols-2
		rounded-md
		text-center
		{props.class ?? ''}
	"
>
	{#if base === Base.DECIMAL}
		{#if opcode !== undefined}
			<p class="opcode">
				{opcode.symbolic}
			</p>
			{#if opcode.takesOperand}
				<p class="operand">
					{#if immediateFlag}
						#{i8(register.lsb).toString(10)}
					{:else}
						{register.lsb.toString(10)}
					{/if}
				</p>
			{/if}
		{:else}
			<!-- TODO: Add translation for invalid opcode-->
			<p class="invalid-instruction">INVALID</p>
		{/if}
	{:else}
		<p class="opcode">
			{u8ToPaddedString(register.msb, base)}
		</p>
		<p class="operand">
			{u8ToPaddedString(register.lsb, base)}
		</p>
	{/if}
</div>
