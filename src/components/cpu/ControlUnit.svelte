<script lang="ts">
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash as flashComponent } from "../../util/animationUtil"

	export async function flash() {
		return flashComponent(
			cuDiv,
			"background-color",
			{ r: 211, g: 211, b: 211 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	let cuDiv: HTMLDivElement
</script>

<div class="control-unit" bind:this={cuDiv}>
	<ComponentLabel text="Control Unit / Decoder" />
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.control-unit {
		@include cpu-component;
		@include center-content;
		left: $cpu-cu-x;
		top: $cpu-cu-y;
		width: $cpu-cu-width;
		height: $cpu-cu-height;
		text-align: center;
	}
</style>
