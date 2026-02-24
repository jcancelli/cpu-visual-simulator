import { ActionType } from "$lib/types/action"
import type { BusID, Register } from "$lib/types/bus"
import { Action } from "../task"

/** Base class for an action regarding busses */
export abstract class BusAction extends Action {}

/** Send a signal on a {@link Bus} */
export class SendSignalBusAction extends BusAction {
	/** The source of the signal */
	public readonly from: Register
	/** The bus carrying the signal */
	public readonly onBus: BusID

	constructor(from: Register, onBus: BusID) {
		super(ActionType.SEND_SIGNAL)
		this.from = from
		this.onBus = onBus
	}
}

/** End the signal on a {@link Bus} */
export class EndSignalBusAction extends BusAction {
	/** The bus carrying the signal */
	public readonly bus: BusID

	constructor(bus: BusID) {
		super(ActionType.END_SIGNAL)
		this.bus = bus
	}
}

/** Read the signal from a {@link Bus} */
export class ReadSignalBusAction extends BusAction {
	/** The destination of the signal */
	public readonly into: Register
	/** The bus carrying the signal */
	public readonly fromBus: BusID

	constructor(into: Register, fromBus: BusID) {
		super(ActionType.READ_SIGNAL)
		this.into = into
		this.fromBus = fromBus
	}
}

/** Send a signal on a {@link Bus} */
export function sendSignalOnBus(from: Register, onBus: BusID): SendSignalBusAction {
	return new SendSignalBusAction(from, onBus)
}

/** End the signal on a {@link Bus} */
export function endSignalOnBus(bus: BusID): EndSignalBusAction {
	return new EndSignalBusAction(bus)
}

/** Read the signal carried by a {@link Bus} and store it into a destination */
export function readSignalFromBus(into: Register, fromBus: BusID): ReadSignalBusAction {
	return new ReadSignalBusAction(into, fromBus)
}
