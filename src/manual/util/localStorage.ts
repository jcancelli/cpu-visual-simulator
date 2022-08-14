import { Language } from "../../shared/util/i18n"
import { LocalStorage } from "../../shared/util/localStorage"

export type ManualLocalStorage = {
	language: Language
}

export const storage = new LocalStorage<ManualLocalStorage>("manual")
