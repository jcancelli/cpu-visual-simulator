import { Language } from "../../shared/util/i18n"
import { LocalStorage } from "../../shared/util/LocalStorage"

export type ManualLocalStorage = {
	language: Language
}

export const storage = new LocalStorage<ManualLocalStorage>("manual")
