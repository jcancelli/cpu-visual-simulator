<script lang="ts">
	import { instructionRegister } from "../../store/cpu"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash } from "../../util/animationUtil"
	import { displayAsBinary } from "../../store/settings"

	export async function flashOpcode() {
		return flash(opcodeDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashOperand() {
		return flash(operandDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	let opcodeDiv: HTMLDivElement
	let operandDiv: HTMLDivElement
	let opcode: string
	let operand: string

	$: {
		if ($displayAsBinary) {
			opcode = $instructionRegister ? $instructionRegister.binaryOpcode() : ""
			operand = $instructionRegister ? $instructionRegister.binaryOperand() : ""
		} else {
			opcode = $instructionRegister ? $instructionRegister.opcode.symbolic : ""
			if ($instructionRegister && $instructionRegister.opcode.takesOperand) {
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
	<div class="flex items-center justify-center w-full h-full rounded-l-md" bind:this={opcodeDiv}>
		{opcode}
	</div>
	<div class="flex items-center justify-center w-full h-full rounded-r-md" bind:this={operandDiv}>
		{operand}
	</div>
</div>
