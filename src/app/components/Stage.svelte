<script lang="ts">
	import { ram as ramComponent, cpu as cpuComponent, wires as wiresComponent } from "../store/components"
	import Wires from "../wires/Wires.svelte"
	import Cpu from "./cpu/Cpu.svelte"
	import CpuModel from "../model/Cpu"
	import RamModel from "../model/Ram"
	import SymbolTableModel from "../model/SymbolTable"
	import Ram from "./ram/Ram.svelte"

	export let cpu: CpuModel
	export let ram: RamModel
	export let symbolTable: SymbolTableModel
	export let animationsEnabled: boolean
</script>

<div class="absolute top-0 left-0 w-app h-app">
	<Wires bind:this={$wiresComponent} {animationsEnabled} />
	<Cpu bind:this={$cpuComponent} {animationsEnabled} {cpu} />
	<Ram bind:this={$ramComponent} {animationsEnabled} {ram} {symbolTable} />
</div>
