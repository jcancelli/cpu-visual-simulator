class LocalStorage<T> {
	public readonly namespace: string

	constructor(namespace: string) {
		this.namespace = namespace
	}

	public set(key: keyof T, value: T[typeof key]): void {
		localStorage.setItem(`${this.namespace}.${String(key)}`, value.toString())
	}

	public get(key: keyof T): T[typeof key] | null {
		return localStorage.getItem(String(key)) as unknown as T[typeof key] | null
	}

	public getOrElse(key: keyof T, orElse: T[typeof key]): T[typeof key] {
		return this.isSet(key) ? (localStorage.getItem(String(key)) as unknown as T[typeof key] | null) : orElse
	}

	public isSet(key: keyof T): boolean {
		return localStorage.getItem(String(key)) !== null
	}
}
