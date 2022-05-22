<script lang="ts">
	import cpuStore from "../../store/cpuStore"
	import displaySettingsStore from "../../store/displaySettingsStore"
	import ComponentLabel from "../ComponentLabel.svelte"
	import { flash } from "../../util/animationUtil"

	export async function flashOpcode() {
		return flash(opcodeDiv, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	export function flashOperand() {
		return flash(operandDiv, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	let opcodeDiv: HTMLDivElement
	let operandDiv: HTMLDivElement
	let opcode: string
	let operand: string

	$: {
		if ($displaySettingsStore.binary) {
			opcode = $cpuStore.instructionRegister ? $cpuStore.instructionRegister.binaryOpcode : ""
			operand = $cpuStore.instructionRegister ? $cpuStore.instructionRegister.binaryOperand : ""
		} else {
			opcode = $cpuStore.instructionRegister ? $cpuStore.instructionRegister.opcode.symbolic : ""
			if ($cpuStore.instructionRegister && $cpuStore.instructionRegister.symbolicOperand !== "") {
				if ($cpuStore.instructionRegister.immediateFlag) {
					operand = `#${$cpuStore.instructionRegister.numericOperand}`
				} else {
					operand = `${$cpuStore.instructionRegister.numericOperand}`
				}
			} else {
				operand = ""
			}
		}
	}
</script>

<div class="ir">
	<ComponentLabel text="IR" top="-20px" left="10px" />
	<div class="opcode" bind:this={opcodeDiv}>{opcode}</div>
	<div class="operand" bind:this={operandDiv}>{operand}</div>
</div>

<style lang="scss">
	@import "../../style/variables.scss";
	@import "../../style/mixins.scss";

	.ir {
		@include cpu-component;
		left: $cpu-ir-x;
		top: $cpu-ir-y;
		width: $cpu-ir-width;
		height: $cpu-ir-height;
		display: grid;
		align-items: center;
		grid-template-columns: 1fr 1fr;
	}

	.opcode,
	.operand {
		@include center-content;
		width: calc($cpu-ir-width / 2);
		height: $cpu-ir-height;
	}

	.opcode {
		border-radius: $cpu-comp-border-radius 0 0 $cpu-comp-border-radius;
	}

	.operand {
		border-radius: 0 $cpu-comp-border-radius $cpu-comp-border-radius 0;
	}
</style>
