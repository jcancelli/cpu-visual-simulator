<script lang="ts">
	import { flash as flashElement } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let element: HTMLDivElement

	const increment = cpu.increment

	export async function flash() {
		if (!animationsEnabled) return
		return flashElement(element, "background-color", { r: 0, g: 255, b: 0, a: 1 })
	}
</script>

<div
	class="
	absolute
	top-[130px]
	left-[570px]
	w-[100px]
	h-[30px]
	leading-[30px]
	text-center
	border
	border-black
	rounded-md
	bg-gray-100
	shadow-component
	font-mono
"
	bind:this={element}
>
	+{$displayAsBinary ? $increment.toBinaryString() : $increment.unsigned()}
</div>
