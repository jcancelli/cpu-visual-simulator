import {
	Readable as SvelteReadable,
	Writable as SvelteWritable,
	writable as svelteWritable,
	readable as svelteReadable,
	derived as svelteDerived,
	StartStopNotifier,
	get
} from "svelte/store"

export interface Readable<T> extends SvelteReadable<T> {
	get(): T
}

export interface Writable<T> extends SvelteWritable<T> {
	get(): T
}

/** One or more `Readable`s. */
type Stores =
	| SvelteReadable<any>
	| [SvelteReadable<any>, ...Array<SvelteReadable<any>>]
	| Array<SvelteReadable<any>>
/** One or more values from `Readable` stores. */
type StoresValues<T> = T extends SvelteReadable<infer U>
	? U
	: {
			[K in keyof T]: T[K] extends SvelteReadable<infer U> ? U : never
	  }

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export function readable<T>(value?: T, start?: StartStopNotifier<T>): Readable<T> {
	const store = svelteReadable(value, start) as Readable<T>
	store.get = () => get(store)
	return store
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export function writable<T>(value?: T, start?: StartStopNotifier<T>): Writable<T> {
	const store = svelteWritable(value, start) as Writable<T>
	store.get = () => get(store)
	return store
}

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 */
export function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>) => T): Readable<T> {
	const store = svelteDerived(stores, fn) as Writable<T>
	store.get = () => get(store)
	return store
}
