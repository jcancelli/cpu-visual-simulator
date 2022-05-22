import { Cache } from "../execution"

export function ZERO_FLAG_SET(cache: Cache): boolean {
	return cache["SW:Z"]
}

export function ZERO_FLAG_NOT_SET(cache: Cache): boolean {
	return !cache["SW:Z"]
}

export function NEGATIVE_FLAG_SET(cache: Cache): boolean {
	return cache["SW:N"]
}

export function NEGATIVE_FLAG_NOT_SET(cache: Cache): boolean {
	return !cache["SW:N"]
}
