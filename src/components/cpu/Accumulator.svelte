<script lang="ts">
	import cpuStore from "../../store/cpuStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash as flashComponent } from "../../util/animationUtil"
	import { displayAsBinary } from "../../store/settings"

	export async function flash() {
		return flashComponent(
			accDiv,
			"background-color",
			{ r: 224, g: 224, b: 224 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	let accDiv: HTMLDivElement
</script>

<div
	class="
		absolute
		top-[550px]
		left-[275px]
		w-[170px]
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
	bind:this={accDiv}
>
	<ComponentLabel text="ACC" top="-25px" left="0" />
	{$displayAsBinary ? $cpuStore.accumulator.toBinaryString() : $cpuStore.accumulator.signed()}
</div>
