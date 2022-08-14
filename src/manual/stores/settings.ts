import { writable } from "svelte/store"
import { getDefaultLanguage, Language } from "../../shared/util/i18n"
import { storage } from "../util/localStorage"

export const language = writable<Language>()

export const defaults = {
	language: getDefaultLanguage()
} as const

export function init() {
	language.set(storage.getOrElse("language", defaults.language) as Language)
	language.subscribe(newValue => storage.set("language", newValue))
}
