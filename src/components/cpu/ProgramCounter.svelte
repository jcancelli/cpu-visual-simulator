<script lang="ts">
	import cpuStore from "../../store/cpuStore"
	import displaySettingsStore from "../../store/displaySettingsStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash } from "../../util/animationUtil"

	export async function flashPC() {
		return flash(pcDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashINC() {
		return flash(incDiv, "background-color", { r: 224, g: 224, b: 224 }, { r: 0, g: 255, b: 0 })
	}

	let pcDiv: HTMLDivElement
	let incDiv: HTMLDivElement
</script>

<div
	class="
	absolute
	top-[70px]
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
	bind:this={pcDiv}
>
	<ComponentLabel text="PC" top="-25px" left="0" />
	{$displaySettingsStore.binary
		? $cpuStore.programCounter.toBinaryString()
		: $cpuStore.programCounter.unsigned()}
</div>
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
	bind:this={incDiv}
>
	+{$displaySettingsStore.binary
		? $cpuStore.increment.toBinaryString()
		: $cpuStore.increment.unsigned()}
</div>
