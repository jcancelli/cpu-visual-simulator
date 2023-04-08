/*
	ADDING A NEW LANGUAGE TO CPUVS:
	1) Add the ISO 639-1 code of the language to the SUPPORTED_LANGUAGES array in this file
	2) Add a file named "<ISO 639-1 code>.svelte" under src/shared/components/flags/.
		This file should contain the 4x3 svg flag of the country representing the language.
		The flag should be sourced from https://github.com/lipis/flag-icons/tree/main/flags/4x3.
		The attribute "class={$$props.class}" should be added to the svg root element of such file 
		(see the other .svelte files in that folder for reference).
	3) Import this new "<ISO 639-1 code>.svelte" file into src/shared/components/selects/LanguageSelect.svelte
		Inside LanguageSelect.svelte there should be a map object named
		"flags", add to it a new entry where a string containing the ISO 639-1 code is mapped to the 
		flag's svelte component.
	4) Add a file named "<ISO 639-1 code>.yaml" to public/resources/i18n/app/ containing all the
		translations for the simulator (see other files in this directory for reference)
	5) Add a file named "<ISO 639-1 code>.yaml" to public/resources/i18n/manual/ containing all the
		translations for the simulator's manual (see other files in this directory for reference)
	6) Translate eventual messages inside .env/develop/resources/messages.yaml and .env/main/resources/messages.yaml
*/

export const SUPPORTED_LANGUAGES = ["en", "it", "es"] as const
export const DEFAULT_LANGUAGE = "en"
export type Language = typeof SUPPORTED_LANGUAGES[number]

export function getDefaultLanguage(): Language {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGUAGES.includes(lang as Language) ? (lang as Language) : DEFAULT_LANGUAGE
}
