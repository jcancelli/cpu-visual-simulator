import { Subscriber, Unsubscriber } from "svelte/store"

/** Notify its subscribers of value changes */
export default class SubscriptionsManager<T> {
	protected subscribers: Subscriber<T>[] = []

	/**
	 * Add a new subscriber
	 * @param {Subscriber} subscriber - Callback to inform of a value updates
	 * @returns {Unsubscriber} Function to unsubscribe from value updates
	 */
	addSubscriber(subscriber: Subscriber<T>): Unsubscriber {
		this.subscribers.push(subscriber)
		return () => {
			this.subscribers = this.subscribers.filter(sub => sub !== subscriber)
		}
	}

	/**
	 * Inform subscribers of a value change
	 * @param {T} newValue - The new value
	 */
	notifySubscribers(newValue: T): void {
		this.subscribers.forEach(subscriber => {
			subscriber(newValue)
		})
	}
}
