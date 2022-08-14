export class LocalStorage<T> {
	public readonly namespace: string

	constructor(namespace: string) {
		this.namespace = namespace
	}

	public set(key: keyof T, value: T[typeof key]): void {
		localStorage.setItem(`${this.namespace}.${key.toString()}`, value.toString())
	}

	public get(key: keyof T): string | null {
		return localStorage.getItem(`${this.namespace}.${key.toString()}`)
	}

	public getOrElse(key: keyof T, orElse: T[typeof key]): string {
		return this.isSet(key) ? this.get(key) : orElse.toString()
	}

	public isSet(key: keyof T): boolean {
		return localStorage.getItem(`${this.namespace}.${key.toString()}`) !== null
	}
}
