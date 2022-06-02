export type WireType = typeof WireTypes[keyof typeof WireTypes]

export const WireTypes = {
	DATA_INT: {
		name: "DATA_INT",
		color: "cyan",
		animationColor: "darkgreen"
	},
	DATA_EXT: {
		name: "DATA_EXT",
		color: "blue",
		animationColor: "lime"
	},
	CONTROL_INT: {
		name: "CONTROL_INT",
		color: "#ff7a90",
		animationColor: "lime"
	},
	CONTROL_EXT: {
		name: "CONTROL_EXT",
		color: "red",
		animationColor: "lime"
	},
	ADDRESS_INT: {
		name: "ADDRESS_INT",
		color: "yellow",
		animationColor: "darkgreen"
	},
	ADDRESS_EXT: {
		name: "ADDRESS_EXT",
		color: "darkorange",
		animationColor: "lime"
	},
	INVISIBLE: {
		name: "INVISIBLE",
		color: "transparent",
		animationColor: "transparent"
	}
} as const

export default WireType
