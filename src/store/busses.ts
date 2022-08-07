import { writable } from "svelte/store"
import BinaryValue from "../util/BinaryValue"
import { isSet, set, str } from "../util/localStorage"

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

// COLORS
// data bus
export const externalDataBusColor = writable<string>(
	isSet("externalDataBusColor") ? str("externalDataBusColor") : "#0000ff"
)
export const internalDataBusColor = writable<string>(
	isSet("internalDataBusColor") ? str("internalDataBusColor") : "#00ffff"
)
export const externalDataBusAnimationColor = writable<string>(
	isSet("externalDataBusAnimationColor") ? str("externalDataBusAnimationColor") : "#00ff00"
)
export const internalDataBusAnimationColor = writable<string>(
	isSet("internalDataBusAnimationColor") ? str("internalDataBusAnimationColor") : "#006400"
)
// address bus
export const externalAddressBusColor = writable<string>(
	isSet("externalAddressBusColor") ? str("externalAddressBusColor") : "#ff8c00"
)
export const internalAddressBusColor = writable<string>(
	isSet("internalAddressBusColor") ? str("internalAddressBusColor") : "#ffff00"
)
export const externalAddressBusAnimationColor = writable<string>(
	isSet("externalAddressBusAnimationColor") ? str("externalAddressBusAnimationColor") : "#00ff00"
)
export const internalAddressBusAnimationColor = writable<string>(
	isSet("internalAddressBusAnimationColor") ? str("internalAddressBusAnimationColor") : "#006400"
)
// control bus
export const externalControlBusColor = writable<string>(
	isSet("externalControlBusColor") ? str("externalControlBusColor") : "#ff0000"
)
export const internalControlBusColor = writable<string>(
	isSet("internalControlBusColor") ? str("internalControlBusColor") : "#ff7a90"
)
export const externalControlBusAnimationColor = writable<string>(
	isSet("externalControlBusAnimationColor") ? str("externalControlBusAnimationColor") : "#00ff00"
)
export const internalControlBusAnimationColor = writable<string>(
	isSet("internalControlBusAnimationColor") ? str("internalControlBusAnimationColor") : "#00ff00"
)

// subscribers so that each value is stored locally
externalDataBusColor.subscribe(newValue => set("externalDataBusColor", newValue))
internalDataBusColor.subscribe(newValue => set("internalDataBusColor", newValue))
externalDataBusAnimationColor.subscribe(newValue => set("externalDataBusAnimationColor", newValue))
internalDataBusAnimationColor.subscribe(newValue => set("internalDataBusAnimationColor", newValue))
externalAddressBusColor.subscribe(newValue => set("externalAddressBusColor", newValue))
internalAddressBusColor.subscribe(newValue => set("internalAddressBusColor", newValue))
externalAddressBusAnimationColor.subscribe(newValue => set("externalAddressBusAnimationColor", newValue))
internalAddressBusAnimationColor.subscribe(newValue => set("internalAddressBusAnimationColor", newValue))
externalControlBusColor.subscribe(newValue => set("externalControlBusColor", newValue))
internalControlBusColor.subscribe(newValue => set("internalControlBusColor", newValue))
externalControlBusAnimationColor.subscribe(newValue => set("externalControlBusAnimationColor", newValue))
internalControlBusAnimationColor.subscribe(newValue => set("internalControlBusAnimationColor", newValue))

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
	inc_pc_address_bus,
	externalDataBusColor,
	internalDataBusColor,
	externalAddressBusColor,
	internalAddressBusColor,
	externalControlBusColor,
	internalControlBusColor,
	externalDataBusAnimationColor,
	internalDataBusAnimationColor,
	externalAddressBusAnimationColor,
	internalAddressBusAnimationColor,
	externalControlBusAnimationColor,
	internalControlBusAnimationColor
}
