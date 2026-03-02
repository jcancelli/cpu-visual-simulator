<script lang="ts">
	import type { WordRegister } from "$lib/register/register.svelte"
	import type { FlashableElement, FlashableID } from "$lib/state/flash_animations_playback.svelte"
	import { Base, i8, u8ToPaddedString } from "$lib/types/integer"
	import { getImmediateFlag, getOpcodeByNumeric } from "$lib/types/opcode"
	import { makeFlashAnimation } from "$lib/util/animation"
	import { unreachable } from "$lib/util/development"

	export interface InstructionRegisterProps {
		register: WordRegister
		base?: Base
		id?: string
		flashableIds?: {
			instructionRegister: FlashableID
			opcode: FlashableID
			operand: FlashableID
		}
		class?: string
	}

	let {
		register,
		base = Base.DECIMAL,
		id,
		flashableIds,
		...props
	}: InstructionRegisterProps = $props()

	const opcode = $derived(getOpcodeByNumeric(register.msb))
	const immediateFlag = $derived(getImmediateFlag(register.msb))

	/** Handle to the html element that represents this component */
	let htmlElement: HTMLElement
	/** Handle to the html element that represents the opcode */
	let opcodeElement: HTMLElement
	/** Handle to the html element that represents the operand */
	let operandElement: HTMLElement

	// Implements FlashableElement
	export function getFlashableID(): FlashableID {
		if (flashableIds !== undefined) {
			return flashableIds.instructionRegister
		}
		unreachable("Flashable ID not defined on InstructionRegister")
	}

	// Implements FlashableElement
	export function createFlashAnimation(): Animation {
		return makeFlashAnimation(htmlElement, {
			background: true,
			text: true,
			border: true,
		})
	}

	// Implements FlashableElement
	export function getFlashableSubelements(): FlashableElement[] {
		if (flashableIds === undefined) {
			unreachable(
				"Flashable ID not defined on InstructionRegister. Unable to get flashable subcomponents.",
			)
		}
		return [
			{
				getFlashableID: () => flashableIds.opcode,
				createFlashAnimation: () => {
					return makeFlashAnimation(opcodeElement, {
						background: true,
						text: true,
					})
				},
				getFlashableSubelements: () => [],
			},
			{
				getFlashableID: () => flashableIds.operand,
				createFlashAnimation: () => {
					return makeFlashAnimation(operandElement, {
						background: true,
						text: true,
					})
				},
				getFlashableSubelements: () => [],
			},
		]
	}
</script>

<div
	bind:this={htmlElement}
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
		shadow-register
		contain-paint
		{props.class ?? ''}
	"
>
	<div
		bind:this={opcodeElement}
		class="
			instruction-register-opcode
			register
			register-foreground
			register-background
			text-center
		"
	>
		{#if base === Base.DECIMAL}
			{#if opcode !== undefined}
				{opcode.symbolic}
			{:else}
				<!-- TODO: Add translation for invalid opcode-->
				INVALID
			{/if}
		{:else}
			{u8ToPaddedString(register.msb, base)}
		{/if}
	</div>
	<div
		bind:this={operandElement}
		class="
			instruction-register-operand
			register
			register-foreground
			register-background
			block
			text-center
		"
	>
		{#if base === Base.DECIMAL}
			{#if opcode !== undefined && opcode.takesOperand}
				{#if immediateFlag}
					#{i8(register.lsb).toString(10)}
				{:else}
					{register.lsb.toString(10)}
				{/if}
			{/if}
		{:else}
			{u8ToPaddedString(register.lsb, base)}
		{/if}
	</div>
</div>
