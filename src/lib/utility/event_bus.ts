/** Event bus that manage listeners to different events */
export default class EventBus<Events extends string, EventsTypes extends TypesMap<Events>> {
	private listeners: ListenersMap<Events, EventsTypes> = {}

	/** Subscribe a new listener to the specified event */
	addListener<Event extends Events>(
		event: Event,
		listener: EventListener<EventsTypes[typeof event]>
	) {
		if (!this.listeners[event]) {
			this.listeners[event] = new Set()
		}
		this.listeners[event].add(listener)
	}

	/** Unsubscribe a new listener to the specified event */
	removeListener<Event extends Events>(
		event: Event,
		listener: EventListener<EventsTypes[typeof event]>
	) {
		if (!this.listeners[event]) {
			return
		}
		this.listeners[event].delete(listener)
	}

	/** Notify all listeners subscribed to the provided event */
	notify<Event extends Events>(event: Event, eventData: EventsTypes[typeof event]) {
		if (!this.listeners[event]) {
			return
		}
		this.listeners[event].forEach(listener => listener(eventData))
	}
}

/** A function that is executed when an event it was subscribed to happens */
export type EventListener<EventDataType> = (data: EventDataType) => void

/** Utility type to map an event key to the event data type */
export type TypesMap<Keys extends string> = {
	[key in Keys]: any
}

type ListenersMap<Keys extends string, Types extends TypesMap<Keys>> = {
	[key in Keys]?: Set<EventListener<Types[key]>>
}
