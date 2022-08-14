import { get, writable } from "svelte/store"
import { getDefaultLanguage, Language } from "../../shared/util/i18n"
import { storage } from "../util/localStorage"
import speechSynthesis from "../util/speechSynthesis"

export const showSettings = writable<boolean>()
export const displayAsBinary = writable<boolean>()
export const displayComponentsLabels = writable<boolean>()
export const displayBussesLabels = writable<boolean>()
export const displayStepText = writable<boolean>()
export const minimalAnimations = writable<boolean>()
export const animationSpeed = writable<number>()
export const language = writable<Language>()
export const ttsEnabled = writable<boolean>()
export const ttsSpeed = writable<number>()
export const ttsVoice = writable<string>()
export const extDataBusColor = writable<string>()
export const intDataBusColor = writable<string>()
export const extDataBusAnimationColor = writable<string>()
export const intDataBusAnimationColor = writable<string>()
export const extAddressBusColor = writable<string>()
export const intAddressBusColor = writable<string>()
export const extAddressBusAnimationColor = writable<string>()
export const intAddressBusAnimationColor = writable<string>()
export const extControlBusColor = writable<string>()
export const intControlBusColor = writable<string>()
export const extControlBusAnimationColor = writable<string>()
export const intControlBusAnimationColor = writable<string>()

export const defaults = {
	showSettings: false,
	displayAsBinary: false,
	displayComponentsLabels: true,
	displayBussesLabels: true,
	displayStepText: false,
	minimalAnimations: false,
	animationSpeed: 1.5,
	language: getDefaultLanguage(),
	ttsEnabled: false,
	ttsSpeed: 1,
	extDataBusColor: "#0000ff",
	intDataBusColor: "#00ffff",
	extDataBusAnimationColor: "#00ff00",
	intDataBusAnimationColor: "#006400",
	extAddressBusColor: "#ff8c00",
	intAddressBusColor: "#ffff00",
	extAddressBusAnimationColor: "#00ff00",
	intAddressBusAnimationColor: "#006400",
	extControlBusColor: "#ff0000",
	intControlBusColor: "#ff7a90",
	extControlBusAnimationColor: "#00ff00",
	intControlBusAnimationColor: "#00ff00"
} as const

// prettier-ignore
export function init() {
	showSettings.set(defaults.showSettings)
	displayAsBinary.set(defaults.displayAsBinary)
	displayComponentsLabels.set(storage.getOrElse("displayComponentsLabels", defaults.displayComponentsLabels) === "true")
	displayBussesLabels.set(storage.getOrElse("displayBussesLabels", defaults.displayBussesLabels) === "true")
	displayStepText.set(storage.getOrElse("displayStepText", defaults.displayStepText) === "true")
	minimalAnimations.set(defaults.minimalAnimations)
	animationSpeed.set(parseFloat(storage.getOrElse("animationSpeed", defaults.animationSpeed)))
	language.set(storage.getOrElse("language", defaults.language) as Language)
	ttsEnabled.set(storage.getOrElse("ttsEnabled", defaults.ttsEnabled) === "true")
	ttsSpeed.set(parseFloat(storage.getOrElse("ttsSpeed", defaults.ttsSpeed)))
	extDataBusColor.set(storage.getOrElse("extDataBusColor", defaults.extDataBusColor))
	intDataBusColor.set(storage.getOrElse("intDataBusColor", defaults.intDataBusColor))
	extDataBusAnimationColor.set(storage.getOrElse("extDataBusAnimationColor", defaults.extDataBusAnimationColor))
	intDataBusAnimationColor.set(storage.getOrElse("intDataBusAnimationColor", defaults.intDataBusAnimationColor))
	extAddressBusColor.set(storage.getOrElse("extAddressBusColor", defaults.extAddressBusColor))
	intAddressBusColor.set(storage.getOrElse("intAddressBusColor", defaults.intAddressBusColor))
	extAddressBusAnimationColor.set(storage.getOrElse("extAddressBusAnimationColor", defaults.extAddressBusAnimationColor))
	intAddressBusAnimationColor.set(storage.getOrElse("intAddressBusAnimationColor", defaults.intAddressBusAnimationColor))
	extControlBusColor.set(storage.getOrElse("extControlBusColor", defaults.extControlBusColor))
	intControlBusColor.set(storage.getOrElse("intControlBusColor", defaults.intControlBusColor))
	extControlBusAnimationColor.set(storage.getOrElse("extControlBusAnimationColor", defaults.extControlBusAnimationColor))
	intControlBusAnimationColor.set(storage.getOrElse("intControlBusAnimationColor", defaults.intControlBusAnimationColor))

	window.addEventListener("load", () => {
		window.speechSynthesis.addEventListener("voiceschanged", () => {
			ttsVoice.set(storage.getOrElse("ttsVoice", speechSynthesis.getAvailableVoices(get(language))[0].name))
		})
		displayComponentsLabels.subscribe(newValue => storage.set("displayComponentsLabels", newValue))
		displayBussesLabels.subscribe(newValue => storage.set("displayBussesLabels", newValue))
		displayStepText.subscribe(newValue => storage.set("displayStepText", newValue))
		animationSpeed.subscribe(newValue => storage.set("animationSpeed", newValue))
		language.subscribe(newValue => storage.set("language", newValue))
		ttsEnabled.subscribe(newValue => storage.set("ttsEnabled", newValue))
		ttsSpeed.subscribe(newValue => storage.set("ttsSpeed", newValue))
		ttsVoice.subscribe(newValue => storage.set("ttsVoice", newValue))
		extDataBusColor.subscribe(newValue => storage.set("extDataBusColor", newValue))
		intDataBusColor.subscribe(newValue => storage.set("intDataBusColor", newValue))
		extDataBusAnimationColor.subscribe(newValue => storage.set("extDataBusAnimationColor", newValue))
		intDataBusAnimationColor.subscribe(newValue => storage.set("intDataBusAnimationColor", newValue))
		extAddressBusColor.subscribe(newValue => storage.set("extAddressBusColor", newValue))
		intAddressBusColor.subscribe(newValue => storage.set("intAddressBusColor", newValue))
		extAddressBusAnimationColor.subscribe(newValue => storage.set("extAddressBusAnimationColor", newValue))
		intAddressBusAnimationColor.subscribe(newValue => storage.set("intAddressBusAnimationColor", newValue))
		extControlBusColor.subscribe(newValue => storage.set("extControlBusColor", newValue))
		intControlBusColor.subscribe(newValue => storage.set("intControlBusColor", newValue))
		extControlBusAnimationColor.subscribe(newValue => storage.set("extControlBusAnimationColor", newValue))
		intControlBusAnimationColor.subscribe(newValue => storage.set("intControlBusAnimationColor", newValue))
	})
}

export function reset() {
	displayComponentsLabels.set(defaults.displayComponentsLabels)
	displayBussesLabels.set(defaults.displayBussesLabels)
	displayStepText.set(defaults.displayStepText)
	animationSpeed.set(defaults.animationSpeed)
	language.set(defaults.language)
	ttsEnabled.set(defaults.ttsEnabled)
	ttsSpeed.set(defaults.ttsSpeed)
	extDataBusColor.set(defaults.extDataBusColor)
	intDataBusColor.set(defaults.intDataBusColor)
	extDataBusAnimationColor.set(defaults.extDataBusAnimationColor)
	intDataBusAnimationColor.set(defaults.intDataBusAnimationColor)
	extAddressBusColor.set(defaults.extAddressBusColor)
	intAddressBusColor.set(defaults.intAddressBusColor)
	extAddressBusAnimationColor.set(defaults.extAddressBusAnimationColor)
	intAddressBusAnimationColor.set(defaults.intAddressBusAnimationColor)
	extControlBusColor.set(defaults.extControlBusColor)
	intControlBusColor.set(defaults.intControlBusColor)
	extControlBusAnimationColor.set(defaults.extControlBusAnimationColor)
	intControlBusAnimationColor.set(defaults.intControlBusAnimationColor)
}
