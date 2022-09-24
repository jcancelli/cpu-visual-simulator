import App from "./App.svelte"
import Cpu from "./model/Cpu"
import Ram from "./model/Ram"
import SymbolTable from "./model/SymbolTable"
import Wires from "./model/Wires"
import {
	cpuStore,
	programExecutionLoopStore,
	programExecutionStore,
	ramStore,
	symbolTableStore,
	wiresStore
} from "./store/state"
import {
	cpu as cpuComponentStore,
	ram as ramComponentStore,
	wires as wiresComponentStore,
	stepText as stepTextComponentStore
} from "./store/components"
import { init as initSettings } from "./store/settings"
import { init as initText } from "./store/text"
import ProgramExecution from "./execution/ProgramExecution"
import NonBlockingLoop from "./execution/NonBlockingLoop"

const ram = new Ram()
const cpu = new Cpu()
const symbolTable = new SymbolTable()
const wires = new Wires()

ramStore.set(ram)
cpuStore.set(cpu)
symbolTableStore.set(symbolTable)
wiresStore.set(wires)

symbolTable.addLabelEditedListener(event => ram.updateLabel(event.oldLabel, event.newLabel))
symbolTable.addLabelRemovedListener(event => ram.removeLabel(event.removedLabel))

initSettings()
initText()

const programExecution = new ProgramExecution(cpu, ram, symbolTable, wires)
const programExecutionLoop = new NonBlockingLoop(programExecution)

programExecutionStore.set(programExecution)
programExecutionLoopStore.set(programExecutionLoop)

const initExecution = () => {
	const cpuComponent = cpuComponentStore.get()
	const ramComponent = ramComponentStore.get()
	const wiresComponent = wiresComponentStore.get()
	const stepTextComponent = stepTextComponentStore.get()

	if (!cpuComponent) throw new Error("cpu component not yet initialized")
	if (!ramComponent) throw new Error("ram component not yet initialized")
	if (!wiresComponent) throw new Error("wires component not yet initialized")
	if (!stepTextComponent) throw new Error("step text component not yet initialized")

	programExecution.executionContext.cpu.component = cpuComponent
	programExecution.executionContext.ram.component = ramComponent
	programExecution.executionContext.wires.component = wiresComponent
	programExecution.executionContext.stepTextComponent = stepTextComponent

	programExecutionLoop.start()
}

const app = new App({
	target: document.body,
	props: {
		cpu,
		ram,
		symbolTable,
		wires,
		programExecution,
		initExecution
	}
})

export default app
