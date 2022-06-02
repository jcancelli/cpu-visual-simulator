<script lang="ts">
	import cpuStore from "../../store/cpuStore"
	import displaySettingsStore from "../../store/displaySettingsStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash as flashComponent } from "../../util/animationUtil"

	export async function flash() {
		return flashComponent(
			accDiv,
			"background-color",
			{ r: 211, g: 211, b: 211 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	let accDiv: HTMLDivElement
</script>

<div class="acc" bind:this={accDiv}>
	<ComponentLabel text="ACC" top="-20px" left="0" />
	{$displaySettingsStore.binary
		? $cpuStore.accumulator.toBinaryString()
		: $cpuStore.accumulator.signed()}
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.acc {
		@include cpu-component;
		@include center-content;
		left: $cpu-acc-x;
		top: $cpu-acc-y;
		width: $cpu-acc-width;
		height: $cpu-acc-height;
	}
</style>
