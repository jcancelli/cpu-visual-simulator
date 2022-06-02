<script lang="ts">
	import ComponentLabel from "../ComponentLabel.svelte"
	import InstructionRegister from "./InstructionRegister.svelte"
	import ControlUnit from "./ControlUnit.svelte"
	import Accumulator from "./Accumulator.svelte"
	import StatusWord from "./StatusWord.svelte"
	import ProgramCounter from "./ProgramCounter.svelte"
	import Multiplexer from "./Multiplexer.svelte"
	import ArithmeticLogicUnit from "./ArithmeticLogicUnit.svelte"
	import { FlashableCpuComponent } from "../../execution/actions/animations/FlashCpu"

	let ir: InstructionRegister
	let cu: ControlUnit
	let pc: ProgramCounter
	let mux: Multiplexer
	let alu: ArithmeticLogicUnit
	let sw: StatusWord
	let acc: Accumulator

	export async function flash(component: FlashableCpuComponent) {
		switch (component) {
			case "IR":
				return Promise.all([ir.flashOpcode(), ir.flashOperand()])
			case "IR:OPC":
				return ir.flashOpcode()
			case "IR:OPR":
				return ir.flashOperand()
			case "PC":
				return pc.flashPC()
			case "INC":
				return pc.flashINC()
			case "MUX":
				return mux.flash()
			case "CU":
				return cu.flash()
			case "ALU:1":
				return alu.flashFirstOperand()
			case "ALU:2":
				return alu.flashSecondOperand()
			case "ALU:OPR":
				return alu.flashOperator()
			case "ACC":
				return acc.flash()
			case "SW:Z":
				return sw.flashZeroFlag()
			case "SW:N":
				return sw.flashNegativeFlag()
		}
	}
</script>

<div class="cpu-bg" />
<div class="cpu">
	<ComponentLabel text="CPU" fontSize="LARGE" top="-30px" left="47%" />
	<InstructionRegister bind:this={ir} />
	<ControlUnit bind:this={cu} />
	<ProgramCounter bind:this={pc} />
	<Multiplexer bind:this={mux} />
	<ArithmeticLogicUnit bind:this={alu} />
	<StatusWord bind:this={sw} />
	<Accumulator bind:this={acc} />
</div>

<style lang="scss">
	@import "../../style/variables.scss";

	.cpu {
		position: absolute;
		left: $cpu-x;
		top: $cpu-y;
		width: $cpu-width;
		height: $cpu-height;
		border: 1px solid black;
		border-radius: 30px;
		z-index: 3;
		box-shadow: 0 0 20px rgba($color: #000000, $alpha: 0.3);
	}

	.cpu-bg {
		position: absolute;
		left: $cpu-x;
		top: $cpu-y;
		width: $cpu-width;
		height: $cpu-height;
		z-index: 1;
		border-radius: 30px;
		border: 1px solid black;
		background-color: rgb(192, 192, 192);
	}
</style>
