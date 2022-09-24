import { ramStore, cpuStore, wiresStore } from "../../../../store/state"
import BusAction from "../BusAction"

export type DataBus = "data_main" | "data_ir_cu" | "data_alu_acc" | "data_alu_sw" | "data_mux_alu"
export type ControlBus = "ctrl_cu_mux" | "ctrl_cu_ram" | "ctrl_cu_alu"
export type AddressBus = "addr_main" | "addr_inc_pc"
export type Bus = DataBus | ControlBus | AddressBus

export type DataBusValueSource = "RAM" | "IR:OPC" | "IR:OPR" | "ALU:RES" | "ACC"
export type ControlBusValueSource = "CU"
export type AddressBusValueSource = "PC" | "INC" | "IR:OPR"
export type ValueSource = DataBusValueSource | ControlBusValueSource | AddressBusValueSource

const DEFAULT_BUSSES = {
	RAM: "data_main",
	"IR:OPC": "data_ir_cu",
	"IR:OPR": "addr_main",
	"ALU:RES": "data_alu_acc",
	ACC: "data_main",
	PC: "addr_main",
	INC: "addr_inc_pc"
} as const

export default class LoadValueOnBus extends BusAction {
	protected valueSource: ValueSource
	protected bus: Bus

	constructor(valueSource: ValueSource, bus: "default" | Bus = "default") {
		super()
		this._name = "LoadValueOnBus"
		this.valueSource = valueSource
		this.bus = bus === "default" ? DEFAULT_BUSSES[valueSource] : bus
	}

	protected async action(): Promise<any> {
		wiresStore.get()[this.bus].set(this.getValueFromSource())
	}

	protected getValueFromSource() {
		switch (this.valueSource) {
			case "RAM":
				return ramStore.get().read(wiresStore.get().addr_main.get().unsigned())
			case "IR:OPC":
				return cpuStore.get().instructionRegister.get().opcodeValue()
			case "IR:OPR":
				return cpuStore.get().instructionRegister.get().operandValue()
			case "ALU:RES":
				return cpuStore.get().aluResult.get()
			case "ACC":
				return cpuStore.get().accumulator.get()
			case "CU":
				throw new Error("CU value not implemented")
			case "PC":
				return cpuStore.get().programCounter.get()
			case "INC":
				return cpuStore.get().increment.get()
			default:
				throw new Error(this.valueSource + " value not implemented")
		}
	}

	toString(): string {
		return `${super.toString()} valueSource: ${this.valueSource} bus: ${this.bus}`
	}
}
