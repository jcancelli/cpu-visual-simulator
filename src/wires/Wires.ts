import Node from "./Node"
import { node } from "./Nodes"
import Wire, { WireType } from "./Wire"

export const DataBusWires = [
	// MAIN BUS
	new Wire(node("RAM:DATA"), node("DATA:1"), WireType.DATA_EXT),
	new Wire(node("DATA:1"), node("DATA:2"), WireType.DATA_EXT, false),
	new Wire(node("DATA:2"), node("DATA:3"), WireType.DATA_INT, false),
	new Wire(node("DATA:3"), node("DATA:4"), WireType.DATA_INT),
	new Wire(node("DATA:4"), node("DATA:5"), WireType.DATA_INT),
	new Wire(node("DATA:5"), node("DATA:6"), WireType.DATA_INT),
	new Wire(node("DATA:6"), node("DATA:7"), WireType.DATA_INT),
	new Wire(node("DATA:6"), node("DATA:8"), WireType.DATA_INT),
	new Wire(node("DATA:8"), node("ALU:1"), WireType.DATA_INT),
	new Wire(node("DATA:7"), node("ACC:1"), WireType.DATA_INT),
	new Wire(node("MUX:3"), node("ALU:2"), WireType.DATA_INT),
	new Wire(node("ALU:4"), node("ACC:2"), WireType.DATA_INT),
	new Wire(node("ALU:3"), node("DATA:11"), WireType.DATA_INT),
	new Wire(node("DATA:11"), node("SW:1"), WireType.DATA_INT),
	new Wire(node("DATA:4"), node("IR:1"), WireType.DATA_INT),
	new Wire(node("IR:3"), node("CU:1"), WireType.DATA_INT),
	new Wire(node("IR:2"), node("DATA:9"), WireType.DATA_INT),
	new Wire(node("DATA:9"), node("DATA:10"), WireType.DATA_INT),
	new Wire(node("DATA:10"), node("MUX:1"), WireType.DATA_INT),
	new Wire(node("DATA:3"), node("MUX:2"), WireType.DATA_INT)
] as const

export const AddressBusWires = [
	new Wire(node("RAM:ADD"), node("ADD:1"), WireType.ADDRESS_EXT, false),
	new Wire(node("ADD:1"), node("ADD:2"), WireType.ADDRESS_INT, false),
	new Wire(node("ADD:2"), node("INC:1"), WireType.ADDRESS_INT),
	new Wire(node("INC:2"), node("PC:1"), WireType.ADDRESS_INT),
	new Wire(node("PC:2"), node("ADD:4"), WireType.ADDRESS_INT),
	new Wire(node("ADD:2"), node("ADD:3"), WireType.ADDRESS_INT),
	new Wire(node("ADD:3"), node("ADD:4"), WireType.ADDRESS_INT),
	new Wire(node("ADD:3"), node("ADD:5"), WireType.ADDRESS_INT),
	new Wire(node("ADD:5"), node("ADD:6"), WireType.INVISIBLE),
	new Wire(node("ADD:6"), node("DATA:10"), WireType.ADDRESS_INT)
] as const

export const ControlBusWires = [
	// CU-MUX
	new Wire(node("CU:2"), node("MUX:4"), WireType.CONTROL_INT),
	// CU-RAM
	new Wire(node("RAM:CTRL"), node("CTRL:1"), WireType.CONTROL_EXT, false),
	new Wire(node("CTRL:1"), node("CTRL:2"), WireType.CONTROL_INT, false),
	new Wire(node("CTRL:2"), node("CTRL:3"), WireType.INVISIBLE),
	new Wire(node("CTRL:3"), node("CTRL:4"), WireType.CONTROL_INT),
	new Wire(node("CTRL:4"), node("CU:3"), WireType.CONTROL_INT),
	// CU-ALU
	new Wire(node("CU:4"), node("CTRL:5"), WireType.CONTROL_INT),
	new Wire(node("CTRL:5"), node("CTRL:6"), WireType.INVISIBLE),
	new Wire(node("CTRL:6"), node("CTRL:7"), WireType.CONTROL_INT),
	new Wire(node("CTRL:7"), node("ALU:5"), WireType.CONTROL_INT)
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
