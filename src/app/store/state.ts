import { writable } from "../util/customStores"
import Cpu from "../model/Cpu"
import Ram from "../model/Ram"
import SymbolTable from "../model/SymbolTable"

export const cpuStore = writable<Cpu>()
export const ramStore = writable<Ram>()
export const symbolTableStore = writable<SymbolTable>()
