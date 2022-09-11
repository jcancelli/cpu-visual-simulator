<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash as flashComponent } from "../../util/animation"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu

	let cuDiv: HTMLDivElement

	export async function flash() {
		return flashComponent(cuDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}
</script>

<div
	class="
		absolute
		top-[230px]
		left-[100px]
		w-[120px]
		h-[60px]
		border
		border-black
		rounded-md
		bg-gray-100
		shadow-component
		flex
		items-center
		justify-center
		text-center	
	"
	bind:this={cuDiv}
>
	<ComponentLabel text="Control Unit / Decoder" />
</div>
