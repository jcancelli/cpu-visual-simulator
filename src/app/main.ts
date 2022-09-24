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
import { storage } from "./util/localStorage"
import { exportProgram, parseProgram } from "./util/programParser"

const ram = new Ram()
const cpu = new Cpu()
const symbolTable = new SymbolTable()
const wires = new Wires()

ramStore.set(ram)
cpuStore.set(cpu)
symbolTableStore.set(symbolTable)
wiresStore.set(wires)

// when a label is edited in the symbol table, all its occurences in the ram are synched
symbolTable.addLabelEditedListener(event => ram.updateLabel(event.oldLabel, event.newLabel))
// when a label is deleted from the symbol table, all its occurences in the ram are replaced by the address that label was mapped to
symbolTable.addLabelRemovedListener(event => ram.removeLabel(event.removedLabel))

// loads the program stored in local storage into the ram (restores previous session)
const program = parseProgram(storage.getOrElse("program", "NOP"))
console.log(program.ram.instructions.get())
ram.import(program.ram)
symbolTable.import(program.symbolTable)

// when the state of the ram or of the symbol table is altered, the program stored in them is saved to local storage
ram.instructions.subscribe(newState => storage.set("program", exportProgram(ram, symbolTable)))
symbolTable.labels.subscribe(newState => storage.set("program", exportProgram(ram, symbolTable)))

initSettings()
initText()

const programExecution = new ProgramExecution(cpu, ram, symbolTable, wires)
const programExecutionLoop = new NonBlockingLoop(programExecution, 20)

programExecutionStore.set(programExecution)
programExecutionLoopStore.set(programExecutionLoop)

const app = new App({
	target: document.body,
	props: {
		cpu,
		ram,
		symbolTable,
		programExecution,
		initExecution
	}
})

export default app

function initExecution() {
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
