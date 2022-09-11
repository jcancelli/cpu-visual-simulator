<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu

	let operand1Div: HTMLDivElement
	let operand2Div: HTMLDivElement
	let operatorDiv: HTMLDivElement

	const alu1 = cpu.alu1
	const alu2 = cpu.alu2
	const aluOperation = cpu.aluOperation

	export async function flashFirstOperand() {
		return flash(operand1Div, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashSecondOperand() {
		return flash(operand2Div, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashOperator() {
		return flash(operatorDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	function splitBinString(bin: string): string {
		return [bin.slice(0, 8), bin.slice(8)].join(" ")
	}
</script>

<div class="absolute top-[380px] left-[210px] w-[300px] h-fit">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="stroke-black stroke-[1.6px] w-full h-full drop-shadow-component fill-gray-100"
		viewBox="-1 -1 450 162"
	>
		<path d="m 0 0 l 192 0 l 32 32 l 32 -32 l 192 0 l -96 160 l -256 0 z" />
	</svg>
	<ComponentLabel text="ALU" top="-25px" left="45%" />
	<div
		class="
			absolute
			flex
			items-center
			justify-center
			top-[15%]
			left-[15%]
			w-[90px] 
			{$displayAsBinary ? 'top-[15%] h-[50px]' : 'top-[20%] h-[30px]'}
			text-center
			leading-tight
			rounded-lg
		"
		bind:this={operand1Div}
	>
		{$displayAsBinary ? splitBinString($alu1.toBinaryString()) : $alu1.signed()}
	</div>
	<div
		class="
			absolute
			flex
			items-center
			justify-center
			top-[50%]
			left-[50%]
			-translate-x-1/2
			w-[30px]
			h-[30px]
			rounded-lg
			font-bold
			text-2xl
			leading-[30px]
		"
		bind:this={operatorDiv}
	>
		{$aluOperation}
	</div>
	<div
		class="
			absolute
			flex
			items-center
			justify-center
			top-[15%]
			right-[15%]
			w-[90px]
			{$displayAsBinary ? 'top-[15%] h-[50px]' : 'top-[20%] h-[30px]'}
			text-center
			leading-tight
			rounded-lg
		"
		bind:this={operand2Div}
	>
		{$displayAsBinary ? splitBinString($alu2.toBinaryString()) : $alu2.signed()}
	</div>
</div>
