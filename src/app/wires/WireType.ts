import { get } from "svelte/store"
import {
	extDataBusColor,
	intDataBusColor,
	extDataBusAnimationColor,
	intDataBusAnimationColor,
	extAddressBusColor,
	intAddressBusColor,
	extAddressBusAnimationColor,
	intAddressBusAnimationColor,
	extControlBusColor,
	intControlBusColor,
	extControlBusAnimationColor,
	intControlBusAnimationColor
} from "../store/settings"

export type WireType = typeof WireTypes[keyof typeof WireTypes]

export const WireTypes = {
	DATA_INT: {
		name: "DATA_INT",
		color: () => get(intDataBusColor),
		animationColor: () => get(intDataBusAnimationColor)
	},
	DATA_EXT: {
		name: "DATA_EXT",
		color: () => get(extDataBusColor),
		animationColor: () => get(extDataBusAnimationColor)
	},
	CONTROL_INT: {
		name: "CONTROL_INT",
		color: () => get(intControlBusColor),
		animationColor: () => get(intControlBusAnimationColor)
	},
	CONTROL_EXT: {
		name: "CONTROL_EXT",
		color: () => get(extControlBusColor),
		animationColor: () => get(extControlBusAnimationColor)
	},
	ADDRESS_INT: {
		name: "ADDRESS_INT",
		color: () => get(intAddressBusColor),
		animationColor: () => get(intAddressBusAnimationColor)
	},
	ADDRESS_EXT: {
		name: "ADDRESS_EXT",
		color: () => get(extAddressBusColor),
		animationColor: () => get(extAddressBusAnimationColor)
	},
	INVISIBLE: {
		name: "INVISIBLE",
		color: () => "transparent",
		animationColor: () => "transparent"
	}
} as const

export default WireType
