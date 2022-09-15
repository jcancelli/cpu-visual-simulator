import App from "./App.svelte"
import Cpu from "./model/Cpu"
import Ram from "./model/Ram"
import SymbolTable from "./model/SymbolTable"
import { ramStore, cpuStore } from "./store/state"
import symbolTableStore from "./store/symbolTable"
import { init as initSettings } from "./store/settings"
import { init as initText } from "./store/text"

const ram = new Ram()
const cpu = new Cpu()
const symbolTable = new SymbolTable()

ramStore.set(ram)
cpuStore.set(cpu)
symbolTableStore.set(symbolTable)

symbolTable.addLabelEditedListener(event => ram.updateLabel(event.oldLabel, event.newLabel))
symbolTable.addLabelRemovedListener(event => ram.removeLabel(event.removedLabel))

initSettings()
initText()

export default new App({
	target: document.body
})
