<script lang="ts">
	import { type Flashable, type FlashableID, type FlashAnimation } from "$lib/flash/animation"
	import { InstructionRegisterFlashAnimation, RegisterFlashAnimation } from "$lib/flash/register"
	import type { WordRegister } from "$lib/register/register.svelte"
	import { Base, i8, u8ToPaddedString } from "$lib/types/integer"
	import { getImmediateFlag, getOpcodeByNumeric } from "$lib/types/opcode"
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

	// Implements Flashable
	export function getFlashableID(): FlashableID {
		if (flashableIds === undefined) {
			unreachable("Flashable ID not defined on InstructionRegister")
		}
		return flashableIds.instructionRegister
	}

	// Implements Flashable
	export function createFlashAnimation(): FlashAnimation {
		if (flashableIds === undefined) {
			unreachable(
				"Flashable ID not defined on InstructionRegister. Cannot create flash animation.",
			)
		}
		return new InstructionRegisterFlashAnimation({
			flashableElementId: flashableIds.instructionRegister,
			instructionRegisterElement: htmlElement,
			opcodeElement,
			operandElement,
		})
	}

	// Implements Flashable
	export function getFlashableSubelements(): Flashable[] {
		if (flashableIds === undefined) {
			unreachable(
				"Flashable ID not defined on InstructionRegister. Unable to get flashable subcomponents.",
			)
		}
		return [
			{
				getFlashableID: () => flashableIds.opcode,
				createFlashAnimation: () => {
					return new RegisterFlashAnimation({
						flashableElementId: flashableIds.opcode,
						element: opcodeElement,
						properties: {
							background: true,
							text: true,
						},
					})
				},
				getFlashableSubelements: () => [],
			},
			{
				getFlashableID: () => flashableIds.operand,
				createFlashAnimation: () => {
					return new RegisterFlashAnimation({
						flashableElementId: flashableIds.operand,
						element: operandElement,
						properties: {
							background: true,
							text: true,
						},
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
