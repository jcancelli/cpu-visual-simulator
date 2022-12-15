import { Writable, writable } from "../util/customStores"
import BinaryValue from "./BinaryValue"

export type DataBus = "data_main" | "data_ir_cu" | "data_alu_acc" | "data_alu_sw" | "data_mux_alu"
export type ControlBus = "ctrl_cu_mux" | "ctrl_cu_ram" | "ctrl_cu_alu"
export type AddressBus = "addr_main" | "addr_inc_pc"
export type Bus = DataBus | ControlBus | AddressBus

/** Class that represents the state of the wires */
export default class Wires {
	public readonly data_main: Writable<BinaryValue>
	public readonly data_ir_cu: Writable<BinaryValue>
	public readonly data_alu_acc: Writable<BinaryValue>
	public readonly data_alu_sw: Writable<BinaryValue>
	public readonly data_mux_alu: Writable<BinaryValue>
	public readonly ctrl_cu_mux: Writable<BinaryValue>
	public readonly ctrl_cu_ram: Writable<BinaryValue>
	public readonly ctrl_cu_alu: Writable<BinaryValue>
	public readonly addr_main: Writable<BinaryValue>
	public readonly addr_inc_pc: Writable<BinaryValue>

	constructor() {
		this.data_main = writable(new BinaryValue(16, 0))
		this.data_ir_cu = writable(new BinaryValue(16, 0))
		this.data_alu_acc = writable(new BinaryValue(16, 0))
		this.data_alu_sw = writable(new BinaryValue(16, 0))
		this.data_mux_alu = writable(new BinaryValue(16, 0))
		this.ctrl_cu_mux = writable(new BinaryValue(16, 0))
		this.ctrl_cu_ram = writable(new BinaryValue(16, 0))
		this.ctrl_cu_alu = writable(new BinaryValue(16, 0))
		this.addr_main = writable(new BinaryValue(16, 0))
		this.addr_inc_pc = writable(new BinaryValue(16, 0))
	}

	public set(bus: Bus, value: BinaryValue): void {
		this[bus].set(value)
	}
}
