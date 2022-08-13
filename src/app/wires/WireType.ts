import { get } from "svelte/store"
import {
	externalAddressBusAnimationColor,
	externalAddressBusColor,
	externalControlBusAnimationColor,
	externalControlBusColor,
	externalDataBusAnimationColor,
	externalDataBusColor,
	internalAddressBusAnimationColor,
	internalAddressBusColor,
	internalControlBusAnimationColor,
	internalControlBusColor,
	internalDataBusAnimationColor,
	internalDataBusColor
} from "../store/busses"

export type WireType = typeof WireTypes[keyof typeof WireTypes]

export const WireTypes = {
	DATA_INT: {
		name: "DATA_INT",
		color: () => get(internalDataBusColor),
		animationColor: () => get(internalDataBusAnimationColor)
	},
	DATA_EXT: {
		name: "DATA_EXT",
		color: () => get(externalDataBusColor),
		animationColor: () => get(externalDataBusAnimationColor)
	},
	CONTROL_INT: {
		name: "CONTROL_INT",
		color: () => get(internalControlBusColor),
		animationColor: () => get(internalControlBusAnimationColor)
	},
	CONTROL_EXT: {
		name: "CONTROL_EXT",
		color: () => get(externalControlBusColor),
		animationColor: () => get(externalControlBusAnimationColor)
	},
	ADDRESS_INT: {
		name: "ADDRESS_INT",
		color: () => get(internalAddressBusColor),
		animationColor: () => get(internalAddressBusAnimationColor)
	},
	ADDRESS_EXT: {
		name: "ADDRESS_EXT",
		color: () => get(externalAddressBusColor),
		animationColor: () => get(externalAddressBusAnimationColor)
	},
	INVISIBLE: {
		name: "INVISIBLE",
		color: () => "transparent",
		animationColor: () => "transparent"
	}
} as const

export default WireType
