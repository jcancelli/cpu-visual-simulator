import Node from "./Node"
import { node } from "./Nodes"
import Wire from "./Wire"
import { WireTypes } from "./WireType"

export const DataBusWires = [
	// MAIN BUS
	new Wire(node("RAM:DATA"), node("DATA:1"), WireTypes.DATA_EXT),
	new Wire(node("DATA:1"), node("DATA:2"), WireTypes.DATA_EXT),
	new Wire(node("DATA:2"), node("DATA:3"), WireTypes.DATA_INT),
	new Wire(node("DATA:3"), node("DATA:4"), WireTypes.DATA_INT),
	new Wire(node("DATA:4"), node("DATA:5"), WireTypes.DATA_INT),
	new Wire(node("DATA:5"), node("DATA:6"), WireTypes.DATA_INT),
	new Wire(node("DATA:6"), node("DATA:7"), WireTypes.DATA_INT),
	new Wire(node("DATA:6"), node("DATA:8"), WireTypes.DATA_INT),
	new Wire(node("DATA:8"), node("ALU:1"), WireTypes.DATA_INT),
	new Wire(node("DATA:7"), node("ACC:1"), WireTypes.DATA_INT),
	new Wire(node("MUX:3"), node("ALU:2"), WireTypes.DATA_INT),
	new Wire(node("ALU:4"), node("ACC:2"), WireTypes.DATA_INT),
	new Wire(node("ALU:3"), node("DATA:11"), WireTypes.DATA_INT),
	new Wire(node("DATA:11"), node("SW:1"), WireTypes.DATA_INT),
	new Wire(node("DATA:4"), node("IR:1"), WireTypes.DATA_INT),
	new Wire(node("IR:3"), node("CU:1"), WireTypes.DATA_INT),
	new Wire(node("IR:2"), node("DATA:9"), WireTypes.DATA_INT),
	new Wire(node("DATA:9"), node("DATA:10"), WireTypes.DATA_INT),
	new Wire(node("DATA:10"), node("MUX:1"), WireTypes.DATA_INT),
	new Wire(node("DATA:3"), node("MUX:2"), WireTypes.DATA_INT)
] as const

export const AddressBusWires = [
	new Wire(node("RAM:ADD"), node("ADD:1"), WireTypes.ADDRESS_EXT),
	new Wire(node("ADD:1"), node("ADD:2"), WireTypes.ADDRESS_INT),
	new Wire(node("ADD:2"), node("INC:1"), WireTypes.ADDRESS_INT),
	new Wire(node("INC:2"), node("PC:1"), WireTypes.ADDRESS_INT),
	new Wire(node("PC:2"), node("ADD:4"), WireTypes.ADDRESS_INT),
	new Wire(node("ADD:2"), node("ADD:3"), WireTypes.ADDRESS_INT),
	new Wire(node("ADD:3"), node("ADD:4"), WireTypes.ADDRESS_INT),
	new Wire(node("ADD:3"), node("ADD:5"), WireTypes.ADDRESS_INT),
	new Wire(node("ADD:5"), node("ADD:6"), WireTypes.INVISIBLE),
	new Wire(node("ADD:6"), node("DATA:10"), WireTypes.ADDRESS_INT)
] as const

export const ControlBusWires = [
	// CU-MUX
	new Wire(node("CU:2"), node("MUX:4"), WireTypes.CONTROL_INT),
	// CU-RAM
	new Wire(node("RAM:CTRL"), node("CTRL:1"), WireTypes.CONTROL_EXT),
	new Wire(node("CTRL:1"), node("CTRL:2"), WireTypes.CONTROL_INT),
	new Wire(node("CTRL:2"), node("CTRL:3"), WireTypes.INVISIBLE),
	new Wire(node("CTRL:3"), node("CTRL:4"), WireTypes.CONTROL_INT),
	new Wire(node("CTRL:4"), node("CU:3"), WireTypes.CONTROL_INT),
	// CU-ALU
	new Wire(node("CU:4"), node("CTRL:5"), WireTypes.CONTROL_INT),
	new Wire(node("CTRL:5"), node("CTRL:6"), WireTypes.INVISIBLE),
	new Wire(node("CTRL:6"), node("CTRL:7"), WireTypes.CONTROL_INT),
	new Wire(node("CTRL:7"), node("ALU:5"), WireTypes.CONTROL_INT)
] as const

export const Wires = [...DataBusWires, ...AddressBusWires, ...ControlBusWires] as const

export function wire(name: string): Wire | undefined {
	return Wires.find(w => w.a.name + "-" + w.b.name === name || w.b.name + "-" + w.a.name === name)
}

export function path(nodePath: Node[]): Wire[] {
	let wirePath: Wire[] = []
	for (let i = 0; i < nodePath.length - 1; i++) {
		wirePath.push(wire(`${nodePath[i].name}-${nodePath[i + 1].name}`))
	}
	return wirePath
}
