<script lang="ts">
	import ComponentLabel from "../ComponentLabel.svelte"
	import cpuStore from "../../store/cpuStore"
	import displaySettingsStore from "../../store/displaySettingsStore"
	import { flash } from "../../util/animationUtil"

	export async function flashFirstOperand() {
		return flash(
			operand1Div,
			"background-color",
			{ r: 224, g: 224, b: 224 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	export async function flashSecondOperand() {
		return flash(
			operand2Div,
			"background-color",
			{ r: 224, g: 224, b: 224 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	export async function flashOperator() {
		return flash(
			operatorDiv,
			"background-color",
			{ r: 224, g: 224, b: 224 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	let operand1Div: HTMLDivElement
	let operand2Div: HTMLDivElement
	let operatorDiv: HTMLDivElement
	let operand1 = ""
	let operand2 = ""

	$: {
		if ($displaySettingsStore.binary) {
			operand1 = $cpuStore.alu1 !== null ? splitBinString($cpuStore.alu1.toBinaryString()) : ""
			operand2 = $cpuStore.alu2 !== null ? splitBinString($cpuStore.alu2.toBinaryString()) : ""
		} else {
			operand1 = $cpuStore.alu1 !== null ? "" + $cpuStore.alu1.signed() : ""
			operand2 = $cpuStore.alu2 !== null ? "" + $cpuStore.alu2.signed() : ""
		}
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
			{$displaySettingsStore.binary ? 'top-[15%] h-[50px]' : 'top-[20%] h-[30px]'}
			text-center
			leading-tight
			rounded-lg
		"
		bind:this={operand1Div}
	>
		{operand1}
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
		"
		bind:this={operatorDiv}
	>
		{$cpuStore.operation}
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
			{$displaySettingsStore.binary ? 'top-[15%] h-[50px]' : 'top-[20%] h-[30px]'}
			text-center
			leading-tight
			rounded-lg
		"
		bind:this={operand2Div}
	>
		{operand2}
	</div>
</div>
