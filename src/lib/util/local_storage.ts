export function setNumber(key: string, num: number): void {
	localStorage.setItem(key, num.toString())
}

export function getNumber(key: string): number | null {
	const str = localStorage.getItem(key)
	if (str === null) {
		return null
	}
	return +str
}

export function setBool(key: string, bool: boolean): void {
	localStorage.setItem(key, bool ? "true" : "false")
}

export function getBool(key: string): boolean | null {
	const str = localStorage.getItem(key)
	if (str === null) {
		return null
	}
	return str === "true"
}

export function setJSON<T>(key: string, obj: T): void {
	localStorage.setItem(key, JSON.stringify(obj))
}

export function getJSON<T>(key: string): T | null {
	const str = localStorage.getItem(key)
	if (str === null) {
		return null
	}
	return JSON.parse(str)
}

export function setString(key: string, str: string): void {
	localStorage.setItem(key, str)
}

export function getString(key: string): string | null {
	return localStorage.getItem(key)
}
