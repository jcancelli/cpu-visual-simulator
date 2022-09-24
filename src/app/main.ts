import App from "./App.svelte"
import Cpu from "./model/Cpu"
import Ram from "./model/Ram"
import SymbolTable from "./model/SymbolTable"
import Wires from "./model/Wires"
import { cpuStore, ramStore, symbolTableStore, wiresStore } from "./store/state"
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

const programExecution = new ProgramExecution(cpu)
const programExecutionLoop = new NonBlockingLoop(programExecution)

programExecutionLoop.start()

initSettings()
initText()

export default new App({
	target: document.body,
	props: {
		cpu,
		ram,
		symbolTable,
		wires,
		programExecution
	}
})
