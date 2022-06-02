<script lang="ts">
	import ComponentLabel from "../ComponentLabel.svelte"
	import cpuStore from "../../store/cpuStore"
	import displaySettingsStore from "../../store/displaySettingsStore"
	import { flash } from "../../util/animationUtil"

	export async function flashFirstOperand() {
		return flash(
			operand1Div,
			"background-color",
			{ r: 211, g: 211, b: 211 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	export async function flashSecondOperand() {
		return flash(
			operand2Div,
			"background-color",
			{ r: 211, g: 211, b: 211 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	export async function flashOperator() {
		return flash(
			operatorDiv,
			"background-color",
			{ r: 211, g: 211, b: 211 },
			{ r: 0, g: 255, b: 0 }
		)
	}

	let operand1Div: HTMLDivElement
	let operand2Div: HTMLDivElement
	let operatorDiv: HTMLDivElement
	let operand1 = ""
	let operand2 = ""

	$: {
		if ($displaySettingsStore.binary) {
			operand1 = $cpuStore.alu1 !== null ? $cpuStore.alu1.toBinaryString() : ""
			operand2 = $cpuStore.alu2 !== null ? $cpuStore.alu2.toBinaryString() : ""
		} else {
			operand1 = $cpuStore.alu1 !== null ? "" + $cpuStore.alu1.signed() : ""
			operand2 = $cpuStore.alu2 !== null ? "" + $cpuStore.alu2.signed() : ""
		}
	}
</script>

<div class="alu">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 450 162">
		<path d="m 0 0 l 192 0 l 32 32 l 32 -32 l 192 0 l -96 160 l -256 0 z" />
	</svg>
	<ComponentLabel text="ALU" top="-20px" left="45%" />
	<div class="operand first" bind:this={operand1Div}>{operand1}</div>
	<div class="operator" bind:this={operatorDiv}>{$cpuStore.operation}</div>
	<div class="operand second" bind:this={operand2Div}>{operand2}</div>
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.alu {
		position: absolute;
		left: $cpu-alu-x;
		top: $cpu-alu-y;
		width: $cpu-alu-width;
		height: $cpu-alu-height;

		svg {
			fill: $cpu-comp-bgcolor;
			stroke-width: 1.6px;
			stroke-linecap: round;
			stroke: black;
			filter: drop-shadow($cpu-comp-shadow);
			height: 100%;
			width: 100%;
		}
	}

	.operand {
		@include center-content;
		position: absolute;
		top: 20%;
		width: 100px;
		height: 30px;
		border-radius: 10px;
	}

	.first {
		left: 13%;
	}

	.second {
		right: 13%;
	}

	.operator {
		@include center-content;
		position: absolute;
		top: 50%;
		left: 45%;
		height: 30px;
		width: 30px;
		border-radius: 10px;
		font-weight: bold;
		font-size: 23px;
	}
</style>
