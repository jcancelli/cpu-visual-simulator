import { get } from "svelte/store"
import busses, { main_address_bus } from "../../../../store/busses"
import cpu from "../../../../store/cpu"
import ram from "../../../../store/ram"
import BusAction from "../BusAction"

export type DataBus =
	| "main_data_bus"
	| "ir_cu_data_bus"
	| "alu_acc_data_bus"
	| "alu_sw_data_bus"
	| "mux_alu_data_bus"
export type ControlBus = "cu_mux_ctrl_bus" | "cu_ram_ctrl_bus" | "cu_alu_ctrl_bus"
export type AddressBus = "main_address_bus" | "inc_pc_address_bus"
export type Bus = DataBus | ControlBus | AddressBus

export type DataBusValueSource = "RAM" | "IR:OPC" | "IR:OPR" | "ALU:RES" | "ACC"
export type ControlBusValueSource = "CU"
export type AddressBusValueSource = "PC" | "INC" | "IR:OPR"
export type ValueSource = DataBusValueSource | ControlBusValueSource | AddressBusValueSource

const DEFAULT_BUSSES = {
	RAM: "main_data_bus",
	"IR:OPC": "ir_cu_data_bus",
	"IR:OPR": "main_address_bus",
	"ALU:RES": "alu_acc_data_bus",
	ACC: "main_data_bus",
	PC: "main_address_bus",
	INC: "inc_pc_address_bus"
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
		busses[this.bus].set(this.getValueFromSource())
	}

	protected getValueFromSource() {
		switch (this.valueSource) {
			case "RAM":
				const address = get(main_address_bus).unsigned()
				return get(ram).read(address).value
			case "IR:OPC":
				return get(cpu.instructionRegister).opcodeValue()
			case "IR:OPR":
				return get(cpu.instructionRegister).operandValue()
			case "ALU:RES":
				return get(cpu.aluResult)
			case "ACC":
				return get(cpu.accumulator)
			case "CU":
				throw new Error("CU value not implemented")
			case "PC":
				return get(cpu.programCounter)
			case "INC":
				return get(cpu.increment)
			default:
				throw new Error(this.valueSource + " value not implemented")
		}
	}

	toString(): string {
		return `${super.toString()} valueSource: ${this.valueSource} bus: ${this.bus}`
	}
}
