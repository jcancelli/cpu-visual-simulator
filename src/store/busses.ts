import { writable } from "svelte/store"
import BinaryValue from "../util/BinaryValue"

export const data_main = writable<BinaryValue>(new BinaryValue(16, 0))
export const data_ir_cu = writable<BinaryValue>(new BinaryValue(16, 0))
export const data_alu_acc = writable<BinaryValue>(new BinaryValue(16, 0))
export const data_alu_sw = writable<BinaryValue>(new BinaryValue(16, 0))
export const data_mux_alu = writable<BinaryValue>(new BinaryValue(16, 0))

export const ctrl_cu_mux = writable<BinaryValue>(new BinaryValue(16, 0))
export const ctrl_cu_ram = writable<BinaryValue>(new BinaryValue(16, 0))
export const ctrl_cu_alu = writable<BinaryValue>(new BinaryValue(16, 0))

export const address_main = writable<BinaryValue>(new BinaryValue(16, 0))
export const address_inc_pc = writable<BinaryValue>(new BinaryValue(16, 0))
