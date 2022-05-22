<script lang="ts">
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash as flashComponent } from "../../util/animationUtil"

	export async function flash() {
		return flashComponent(muxElement, "fill", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	let muxElement: SVGSVGElement
</script>

<div class="mux">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 102 42" bind:this={muxElement}>
		<path d="M 0 0 L 100 0 L 80 40 L 20 40 Z" />
	</svg>
	<ComponentLabel text="MUX" />
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.mux {
		@include center-content;
		position: absolute;
		left: $cpu-mux-x;
		top: $cpu-mux-y;
		width: $cpu-mux-width;
		height: $cpu-mux-height;
		text-align: center;

		svg {
			fill: $cpu-comp-bgcolor;
			stroke-width: 1px;
			stroke-linecap: round;
			stroke: black;
			filter: drop-shadow($cpu-comp-shadow);
			height: 100%;
			width: 100%;
		}
	}
</style>
