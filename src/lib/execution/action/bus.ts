import { ActionType } from "$lib/types/action"
import type { BusID, RegisterID } from "$lib/types/bus"
import { Action } from "../task"

/** Base class for an action regarding busses */
export abstract class BusAction extends Action {}

/** Send a signal on a {@link Bus} */
export class SendSignalBusAction extends BusAction {
	/** The source of the signal */
	public readonly from: RegisterID
	/** The bus carrying the signal */
	public readonly onBus: BusID

	constructor(from: RegisterID, onBus: BusID) {
		super()
		this.from = from
		this.onBus = onBus
	}

	override get actionType(): ActionType {
		return ActionType.SEND_SIGNAL
	}
}

/** End the signal on a {@link Bus} */
export class EndSignalBusAction extends BusAction {
	/** The bus carrying the signal */
	public readonly bus: BusID

	constructor(bus: BusID) {
		super()
		this.bus = bus
	}

	override get actionType(): ActionType {
		return ActionType.END_SIGNAL
	}
}

/** Read the signal from a {@link Bus} */
export class ReadSignalBusAction extends BusAction {
	/** The destination of the signal */
	public readonly into: RegisterID
	/** The bus carrying the signal */
	public readonly fromBus: BusID

	constructor(into: RegisterID, fromBus: BusID) {
		super()
		this.into = into
		this.fromBus = fromBus
	}

	override get actionType(): ActionType {
		return ActionType.READ_SIGNAL
	}
}

/** Send a signal on a {@link Bus} */
export function sendSignalOnBus(from: RegisterID, onBus: BusID): SendSignalBusAction {
	return new SendSignalBusAction(from, onBus)
}

/** End the signal on a {@link Bus} */
export function endSignalOnBus(bus: BusID): EndSignalBusAction {
	return new EndSignalBusAction(bus)
}

/** Read the signal carried by a {@link Bus} and store it into a destination */
export function readSignalFromBus(into: RegisterID, fromBus: BusID): ReadSignalBusAction {
	return new ReadSignalBusAction(into, fromBus)
}
