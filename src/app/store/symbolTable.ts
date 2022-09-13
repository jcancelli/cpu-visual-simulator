import { writable } from "../util/customStores"
import SymbolTable from "../model/SymbolTable"

const symbolTable = writable<SymbolTable>()

export default symbolTable
