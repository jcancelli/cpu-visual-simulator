<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import text from "../../store/text"
	import Cpu from "../../model/Cpu"
	import { Color } from "../../util/colors"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let opcodeDiv: HTMLDivElement
	let operandDiv: HTMLDivElement

	let opcode: string
	let operand: string

	const instructionRegister = cpu.instructionRegister

	$: {
		if ($displayAsBinary) {
			opcode = $instructionRegister.binaryOpcode()
			operand = $instructionRegister.binaryOperand()
		} else {
			if ($instructionRegister.opcode) {
				opcode = $instructionRegister.opcode.symbolic
				if ($instructionRegister.opcode.takesOperand) {
					if ($instructionRegister.immediateFlag()) {
						operand = `#${$instructionRegister.numericOperand()}`
					} else {
						operand = `${$instructionRegister.numericOperand()}`
					}
				} else {
					operand = ""
				}
			}
		}
	}

	export async function flashOpcode() {
		if (!animationsEnabled) return
		if (!opcodeDiv) return
		return flash(opcodeDiv, "background-color", Color.GREEN)
	}

	export async function flashOperand() {
		if (!animationsEnabled) return
		if (!operandDiv) return
		return flash(operandDiv, "background-color", Color.GREEN)
	}
</script>

<div
	class="
	absolute
	top-[100px]
	left-[110px]
	w-[200px]
	h-[30px]
	border
	border-black
	rounded-md
	bg-gray-100
	shadow-component
	grid
	items-center
	grid-cols-2
	font-mono
"
>
	<ComponentLabel text="IR" top="-25px" left="10px" />
	{#if !$instructionRegister.opcode && !$displayAsBinary}
		<div class="w-[200px] h-[30px] leading-[30px] col-span-2 text-center rounded-md bg-gray-100">
			{$text.cpu.ir.invalid_instruction}
		</div>
	{:else}
		<div class="w-full h-[28px] leading-[30px] text-center rounded-l-md bg-gray-100" bind:this={opcodeDiv}>
			{opcode}
		</div>
		<div class="w-full h-[28px] leading-[30px] text-center rounded-r-md bg-gray-100" bind:this={operandDiv}>
			{operand}
		</div>
	{/if}
</div>
