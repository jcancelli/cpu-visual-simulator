import Cpu from "../model/Cpu"
import Ram from "../model/Ram"
import SymbolTable from "../model/SymbolTable"
import Wires from "../model/Wires"
import CpuComponent from "../components/cpu/Cpu.svelte"
import RamComponent from "../components/ram/Ram.svelte"
import WiresComponent from "../wires/Wires.svelte"
import StepText from "../components/controls/StepText.svelte"

export type ExecutionContext = {
	cpu: {
		model: Cpu
		component: CpuComponent
	}
	ram: {
		model: Ram
		component: RamComponent
	}
	wires: {
		model: Wires
		component: WiresComponent
	}
	symbolTable: SymbolTable
	stepTextComponent: StepText
}
