<script lang="ts">
	import { instructionRegister } from "../../store/cpu"
	import ComponentLabel from "../labels/Component.svelte"
	import { flash } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import lang from "../../store/lang"

	export async function flashOpcode() {
		if (!opcodeDiv) return
		return flash(opcodeDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashOperand() {
		if (!operandDiv) return
		return flash(operandDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	let opcodeDiv: HTMLDivElement
	let operandDiv: HTMLDivElement

	let opcode: string
	let operand: string

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
"
>
	<ComponentLabel text="IR" top="-25px" left="10px" />
	{#if !$instructionRegister.opcode && !$displayAsBinary}
		<div class="w-[200px] h-[30px] rounded-md col-span-2 flex justify-center items-center leading-3">
			{$lang.cpu.ir.invalid_instruction}
		</div>
	{:else}
		<div class="flex items-center justify-center w-full h-full rounded-l-md" bind:this={opcodeDiv}>
			{opcode}
		</div>
		<div class="flex items-center justify-center w-full h-full rounded-r-md" bind:this={operandDiv}>
			{operand}
		</div>
	{/if}
</div>
