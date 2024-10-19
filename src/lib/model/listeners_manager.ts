export type Listener<EventType> = (event: EventType) => void

/** Utility to manage listeners */
export default class ListenersManager<EventType> {
	private readonly listeners: Set<Listener<EventType>> = new Set()

	/** Notify all the listeners */
	notify(event: EventType) {
		this.listeners.forEach(listener => listener(event))
	}

	/** Add an event listener */
	addListener(listener: Listener<EventType>) {
		this.listeners.add(listener)
	}

	/** Remove and event listener */
	removeListener(listener: Listener<EventType>) {
		this.listeners.delete(listener)
	}
}
