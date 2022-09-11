<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash } from "../../util/animation"
	import Logger from "../../util/logger"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu

	let swzDiv: HTMLDivElement
	let swnDiv: HTMLDivElement

	$: negativeFlag = cpu.negativeFlag
	$: zeroFlag = cpu.zeroFlag

	export async function flashZeroFlag() {
		return flash(swzDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashNegativeFlag() {
		return flash(swnDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	function toggleZeroFlag() {
		Logger.info(`Toggled zero flag: "${!$zeroFlag}"`, "USER_INPUT")
		$zeroFlag = !$zeroFlag
		flashZeroFlag()
	}

	function toggleNegativeFlag() {
		Logger.info(`Toggled negative flag: "${!$negativeFlag}"`, "USER_INPUT")
		$negativeFlag = !$negativeFlag
		flashNegativeFlag()
	}
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
		class="relative h-full flex items-center justify-center w-[19%] border border-r-black rounded-l-md cursor-pointer"
		bind:this={swzDiv}
		on:click={toggleZeroFlag}
	>
		<ComponentLabel text="Z" bottom="-21px" left="25%" />
		{$zeroFlag ? "1" : "0"}
	</div>
	<div
		class="relative h-full flex items-center justify-center w-[19%] cursor-pointer"
		bind:this={swnDiv}
		on:click={toggleNegativeFlag}
	>
		<ComponentLabel text="N" bottom="-21px" left="25%" />
		{$negativeFlag ? "1" : "0"}
	</div>
	<div class="relative h-full flex items-center justify-center w-[62%] border border-l-black rounded-r-md">
		------
	</div>
</div>
<div
	class="absolute top-[550px] left-[540px] w-[120px] h-[30px] rounded-md border border-black pointer-events-none"
/>
<!-- the purpose of this last div is to give a border to the component. The border was buggy when given directly to the component -->
