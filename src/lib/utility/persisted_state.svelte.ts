import { browser } from "$app/environment"

/** State rune persisted in local storage */
export default class PersistedState<T> {
	/** Local storage key associated to the value */
	public readonly key: string
	/** The value */
	public value: T = $state() as T

	constructor(key: string, initialValue: T) {
		this.key = key

		if (browser) {
			const item = localStorage.getItem(this.key)
			if (item) {
				this.value = JSON.parse(item)
			} else {
				this.value = initialValue
			}
		} else {
			this.value = initialValue
		}

		$effect(() => {
			localStorage.setItem(this.key, JSON.stringify(this.value))
		})
	}
}

/** Return a $state rune that is persisted to local storage */
export function persisted<T>(key: string, value: T): PersistedState<T> {
	return new PersistedState(key, value)
}
