import { assertSignal, type Bus, type BusSizeBits } from "$lib/bus/bus.svelte"
import type { Register, RegisterSizeBits } from "$lib/register/register.svelte"
import { ActionType } from "$lib/types/action"
import type { BusID, RegisterID } from "$lib/types/bus"
import { assert } from "$lib/util/development"
import type { ActionHandler } from "../action_handler"
import type { EndSignalBusAction, ReadSignalBusAction, SendSignalBusAction } from "../action/bus"

/** Busses indexed by their ID */
export type BusByID = {
	[ID in BusID]: Bus<BusSizeBits>
}

/** Registers indexed by their ID */
export type RegisterByID = {
	[ID in RegisterID]: Register<RegisterSizeBits>
}

/** {@link ActionHandler} for {@link SendSignalBusAction} */
export class SendSignalActionHandler implements ActionHandler<SendSignalBusAction> {
	private readonly busses: BusByID
	private readonly registers: RegisterByID

	constructor(busses: BusByID, registers: RegisterByID) {
		this.busses = busses
		this.registers = registers
	}

	get actionType(): ActionType {
		return ActionType.SEND_SIGNAL
	}

	handle(action: SendSignalBusAction): void {
		const register = this.registers[action.from]
		const bus = this.busses[action.onBus]
		assert(register.sizeBits <= bus.sizeBits)
		bus.sendSignalUnsigned(register.unsigned)
	}
}

/** {@link ActionHandler} for {@link EndSignalBusAction} */
export class EndSignalActionHandler implements ActionHandler<EndSignalBusAction> {
	private readonly busses: BusByID

	constructor(busses: BusByID) {
		this.busses = busses
	}

	get actionType(): ActionType {
		return ActionType.END_SIGNAL
	}

	handle(action: EndSignalBusAction): void {
		const bus = this.busses[action.bus]
		bus.endSignal()
	}
}

/** {@link ActionHandler} for {@link ReadSignalBusAction} */
export class ReadSignalActionHandler implements ActionHandler<ReadSignalBusAction> {
	private readonly busses: BusByID
	private readonly registers: RegisterByID

	constructor(busses: BusByID, registers: RegisterByID) {
		this.busses = busses
		this.registers = registers
	}

	get actionType(): ActionType {
		return ActionType.READ_SIGNAL
	}

	handle(action: ReadSignalBusAction): void {
		const register = this.registers[action.into]
		const bus = this.busses[action.fromBus]
		assert(register.sizeBits <= bus.sizeBits)
		assertSignal(bus.unsigned, action.fromBus)
		register.unsigned = bus.unsigned
	}
}
