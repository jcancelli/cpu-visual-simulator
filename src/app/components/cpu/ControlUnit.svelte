<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash as flashComponent } from "../../util/animation"
	import { Color } from "../../util/colors"

	export let animationsEnabled: boolean

	let cuDiv: HTMLDivElement

	export async function flash() {
		if (!animationsEnabled) return
		return flashComponent(cuDiv, "background-color", Color.GREEN)
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
