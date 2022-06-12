<script lang="ts">
	import cpuStore from "../../store/cpuStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash } from "../../util/animationUtil"

	export async function flashZeroFlag() {
		return flash(swzDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashNegativeFlag() {
		return flash(swnDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	let swzDiv: HTMLDivElement
	let swnDiv: HTMLDivElement
</script>

<div
	class="
	absolute
	top-[550px]
	left-[540px]
	w-[120px]
	h-[30px]
	rounded-md
	bg-gray-100
	shadow-component
	flex
	items-center
	justify-center
"
>
	<ComponentLabel text="SW" top="-25px" left="0" />
	<div
		class="relative h-full flex items-center justify-center w-[19%] border border-r-black rounded-l-md"
		bind:this={swzDiv}
	>
		<ComponentLabel text="Z" bottom="-21px" left="25%" />
		{$cpuStore.zeroFlag ? "1" : "0"}
	</div>
	<div class="relative h-full flex items-center justify-center w-[19%]" bind:this={swnDiv}>
		<ComponentLabel text="N" bottom="-21px" left="25%" />
		{$cpuStore.negativeFlag ? "1" : "0"}
	</div>
	<div
		class="relative h-full flex items-center justify-center w-[62%] border border-l-black rounded-r-md"
	>
		------
	</div>
</div>
<div class="absolute top-[550px] left-[540px] w-[120px] h-[30px] rounded-md border border-black" />
<!-- the purpose of this last div is to give a border to the component. The border was buggy when given directly to the component -->
