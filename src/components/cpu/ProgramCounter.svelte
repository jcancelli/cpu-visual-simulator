<script lang="ts">
	import { unsignedToBinary8bit } from "../../util/binaryUtil"
	import cpuStore from "../../store/cpuStore"
	import displaySettingsStore from "../../store/displaySettingsStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { WORD_SIZE } from "../../util/ramUtil"
	import { flash } from "../../util/animationUtil"

	export async function flashPC() {
		return flash(pcDiv, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashINC() {
		return flash(incDiv, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	let pcDiv: HTMLDivElement
	let incDiv: HTMLDivElement
</script>

<div class="pc" bind:this={pcDiv}>
	<ComponentLabel text="PC" top="-20px" left="0" />
	{$displaySettingsStore.binary
		? unsignedToBinary8bit($cpuStore.programCounter)
		: $cpuStore.programCounter}
</div>
<div class="inc" bind:this={incDiv}>
	+{$displaySettingsStore.binary ? unsignedToBinary8bit(WORD_SIZE) : WORD_SIZE}
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.pc,
	.inc {
		@include cpu-component;
		@include center-content;
	}

	.pc {
		left: $cpu-pc-x;
		top: $cpu-pc-y;
		width: $cpu-pc-width;
		height: $cpu-pc-height;
	}

	.inc {
		left: $cpu-inc-x;
		top: $cpu-inc-y;
		width: $cpu-inc-width;
		height: $cpu-inc-height;
	}
</style>
