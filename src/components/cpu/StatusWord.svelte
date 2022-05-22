<script lang="ts">
	import cpuStore from "../../store/cpuStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash } from "../../util/animationUtil"

	export async function flashZeroFlag() {
		return flash(swzDiv, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	export async function flashNegativeFlag() {
		return flash(swnDiv, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	let swzDiv: HTMLDivElement
	let swnDiv: HTMLDivElement
</script>

<div class="sw">
	<ComponentLabel text="SW" top="-20px" left="0" />
	<div class="zero" bind:this={swzDiv}>
		<ComponentLabel text="Z" bottom="-20px" left="25%" />
		{$cpuStore.zeroFlag ? "1" : "0"}
	</div>
	<div class="negative" bind:this={swnDiv}>
		<ComponentLabel text="N" bottom="-20px" left="25%" />
		{$cpuStore.negativeFlag ? "1" : "0"}
	</div>
	<div class="other">------</div>
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.sw {
		@include cpu-component;
		@include center-content;
		left: $cpu-sw-x;
		top: $cpu-sw-y;
		width: $cpu-sw-width;
		height: $cpu-sw-height;
	}

	.zero,
	.negative,
	.other {
		@include center-content;
		position: relative;
		height: $cpu-sw-height;
	}

	.zero,
	.negative {
		width: 19%;
		border-right: 1px solid black;
	}

	.zero {
		border-radius: $cpu-comp-border-radius 0 0 $cpu-comp-border-radius;
	}

	.other {
		width: 62%;
	}
</style>
