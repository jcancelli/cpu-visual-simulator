import type { Subscriber, Unsubscriber, Updater, Writable } from "svelte/store"

/** Custom implementation of svelte Writable stores, which also implements value validation */
export default abstract class Store<T> implements Writable<T> {
	private value: T
	private readonly subscribers: Set<Subscriber<T>> = new Set()

	constructor(initialValue: T) {
		this.value = initialValue
	}

	/** Set the store's value.
	 * Notify subscribers only if the value has changed.
	 * Throws error if validation fails */
	set(value: T) {
		this.validate(value)
		if (!this.valueHasChanged(this.value, value)) {
			return
		}
		this.value = value
		this.subscribers.forEach(subscriber => subscriber(this.value))
	}

	/** Returns the store's value, without needing to subscribe */
	get(): T {
		return this.value
	}

	/** Update the store's value.
	 * Notify subscribers only if the value has changed.
	 * Throws error if validation fails */
	update(updater: Updater<T>) {
		const newValue = updater(this.value)
		this.validate(newValue)
		if (!this.valueHasChanged(this.value, newValue)) {
			return
		}
		this.value = newValue
		this.subscribers.forEach(subscriber => subscriber(this.value))
	}

	/** Subscribe a listener for value changes */
	subscribe(run: Subscriber<T>): Unsubscriber {
		run(this.value)
		this.subscribers.add(run)
		return () => this.subscribers.delete(run)
	}

	/** Implements validation for the set and update methods.
	 * Should throw an error on validation fail */
	protected abstract validate(value: T): void
	/** Returns wether or not the newValue should be considered changed
	 * (and therefore subscribers should be notified) */
	protected abstract valueHasChanged(oldValue: T, newValue: T): boolean
}
