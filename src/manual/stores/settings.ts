import { writable } from "svelte/store"
import { DEFAULT_LANGUAGE, Language } from "../../shared/util/i18n"
import { storage } from "../util/localStorage"

export const language = writable<Language>()

export const defaults = {
	language: DEFAULT_LANGUAGE
} as const

export function init() {
	language.set(storage.getOrElse("language", defaults.language) as Language)
}
