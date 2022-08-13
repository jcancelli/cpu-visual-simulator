import { SupportedLang } from "../store/settings"

export function set(key: string, value: any) {
	localStorage.setItem(key, value.toString())
}

export function isSet(key: string): boolean {
	return localStorage.getItem(key) !== null
}

export function bool(key: string): boolean {
	return localStorage.getItem(key) === "true"
}

export function num(key: string): number {
	return +localStorage.getItem(key)
}

export function str(key: string): string {
	return localStorage.getItem(key)
}

export function lang(key: string): SupportedLang {
	return localStorage.getItem(key) as unknown as SupportedLang
}
