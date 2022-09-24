import { writable } from "../util/customStores"
import Cpu from "../model/Cpu"
import Ram from "../model/Ram"
import SymbolTable from "../model/SymbolTable"
import Wires from "../model/Wires"

export const cpuStore = writable<Cpu>()
export const ramStore = writable<Ram>()
export const symbolTableStore = writable<SymbolTable>()
export const wiresStore = writable<Wires>()
