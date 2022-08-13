<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import InstructionRegister from "./InstructionRegister.svelte"
	import ControlUnit from "./ControlUnit.svelte"
	import Accumulator from "./Accumulator.svelte"
	import Increment from "./Increment.svelte"
	import StatusWord from "./StatusWord.svelte"
	import ProgramCounter from "./ProgramCounter.svelte"
	import Multiplexer from "./Multiplexer.svelte"
	import ArithmeticLogicUnit from "./ArithmeticLogicUnit.svelte"
	import { FlashableCpuComponent } from "../../execution/actions/cpu/animation/FlashCpu"

	let ir: InstructionRegister
	let cu: ControlUnit
	let pc: ProgramCounter
	let inc: Increment
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
				return pc.flash()
			case "INC":
				return inc.flash()
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

<div
	class="absolute left-[50px] top-[50px] w-[700px] h-[620px] z-[1] rounded-[30px] bg-gray-300 shadow-cpu"
/>
<div class="absolute left-[50px] top-[50px] w-[700px] h-[620px] z-[3] rounded-[30px] border border-black">
	<ComponentLabel text="CPU" fontSize="LARGE" top="-30px" left="47%" />
	<InstructionRegister bind:this={ir} />
	<ControlUnit bind:this={cu} />
	<ProgramCounter bind:this={pc} />
	<Increment bind:this={inc} />
	<Multiplexer bind:this={mux} />
	<ArithmeticLogicUnit bind:this={alu} />
	<StatusWord bind:this={sw} />
	<Accumulator bind:this={acc} />
</div>
