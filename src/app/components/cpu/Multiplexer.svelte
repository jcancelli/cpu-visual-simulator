<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash as flashComponent } from "../../util/animation"
	import { Color } from "../../util/colors"

	export let animationsEnabled: boolean

	let muxElement: SVGSVGElement

	export async function flash() {
		if (!animationsEnabled) return
		return flashComponent(muxElement, "fill", Color.GREEN)
	}
</script>

<div
	class="absolute top-[240px] left-[400px] w-[100px] h-[40px] text-center flex items-center justify-center"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="fill-gray-100 stroke-black drop-shadow-component h-full w-full"
		viewBox="-1 -1 102 42"
		bind:this={muxElement}
	>
		<path d="M 0 0 L 100 0 L 80 40 L 20 40 Z" />
	</svg>
	<ComponentLabel text="MUX" />
</div>
