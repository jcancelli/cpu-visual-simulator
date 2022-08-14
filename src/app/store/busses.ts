import { writable } from "svelte/store"
import BinaryValue from "../util/BinaryValue"

export const main_data_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const ir_cu_data_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const alu_acc_data_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const alu_sw_data_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const mux_alu_data_bus = writable<BinaryValue>(new BinaryValue(16, 0))

export const cu_mux_ctrl_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const cu_ram_ctrl_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const cu_alu_ctrl_bus = writable<BinaryValue>(new BinaryValue(16, 0))

export const main_address_bus = writable<BinaryValue>(new BinaryValue(16, 0))
export const inc_pc_address_bus = writable<BinaryValue>(new BinaryValue(16, 0))

export default {
	main_data_bus,
	ir_cu_data_bus,
	alu_acc_data_bus,
	alu_sw_data_bus,
	mux_alu_data_bus,
	cu_mux_ctrl_bus,
	cu_ram_ctrl_bus,
	cu_alu_ctrl_bus,
	main_address_bus,
	inc_pc_address_bus
}
