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
		return flashElement(element, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}
</script>

<div
	class="
	absolute
	top-[130px]
	left-[570px]
	w-[100px]
	h-[30px]
	border
	border-black
	rounded-md
	bg-gray-100
	shadow-component
	flex
	items-center
	justify-center
"
	bind:this={element}
>
	+{$displayAsBinary ? $increment.toBinaryString() : $increment.unsigned()}
</div>
