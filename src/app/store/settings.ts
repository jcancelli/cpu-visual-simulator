import { writable } from "../util/customStores"
import { getDefaultLanguage, Language } from "../../shared/util/i18n"
import { storage } from "../util/localStorage"
import speechSynthesis from "../util/speechSynthesis"
import logger, { LogCategory } from "../util/logger"

export const showSettings = writable<boolean>()
export const showLogsExplorer = writable<boolean>()
export const displayAsBinary = writable<boolean>()
export const displayComponentsLabels = writable<boolean>()
export const displayBussesLabels = writable<boolean>()
export const displayStepText = writable<boolean>()
export const minimalAnimations = writable<boolean>()
export const animationsEnabled = writable<boolean>()
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
	showLogsExplorer: false,
	displayAsBinary: false,
	displayComponentsLabels: true,
	displayBussesLabels: true,
	displayStepText: false,
	minimalAnimations: false,
	animationsEnabled: true,
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
export async function init() {
	logger.debug("Initializing settings", LogCategory.INIT)

	logger.debug("Initializing settings values", LogCategory.INIT)
	showSettings.set(defaults.showSettings)
	showLogsExplorer.set(defaults.showLogsExplorer)
	displayAsBinary.set(defaults.displayAsBinary)
	displayComponentsLabels.set(storage.getOrElse("displayComponentsLabels", defaults.displayComponentsLabels) === "true")
	displayBussesLabels.set(storage.getOrElse("displayBussesLabels", defaults.displayBussesLabels) === "true")
	displayStepText.set(storage.getOrElse("displayStepText", defaults.displayStepText) === "true")
	minimalAnimations.set(defaults.minimalAnimations)
	animationsEnabled.set(defaults.animationsEnabled)
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
	logger.debug("Settings values initialized", LogCategory.INIT)

	await new Promise<void>(resolve => {
		const initTtsVoice = () => {
			logger.debug("Initializing ttsVoice setting (onvoicechanged event)", LogCategory.INIT)
			ttsVoice.set(storage.getOrElse("ttsVoice", speechSynthesis.getAvailableVoices(language.get())[0].name))
			// note: svelte stores subscribe method triggers the callback. 
			// This means that the callback is executed even if the store value didn't change
			// That's why here I save the ttsVoice value into a variable to re-set ttsVoice after calling
			// the language.subscribe method
			const ttsVoiceValue = ttsVoice.get()
			language.subscribe(newValue => ttsVoice.set(speechSynthesis.getAvailableVoices(newValue)[0].name))
			ttsVoice.subscribe(newValue => storage.set("ttsVoice", newValue))
			ttsVoice.set(ttsVoiceValue)
			window.speechSynthesis.removeEventListener("voiceschanged", initTtsVoice)
			logger.debug("ttsVoice setting initialized", LogCategory.INIT)
			resolve()
		}
		// This if is needed because Firefox doesn't fire the onvoiceschanged event.
		// Because of this, this promise would never resolve and the simulator wouldn't complete
		// its initialization.
		// see https://contest-server.cs.uchicago.edu/ref/JavaScript/developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/onvoiceschanged.html
		if (window.speechSynthesis.getVoices().length === 0) {
			// for every browser except firefox
			window.speechSynthesis.onvoiceschanged = initTtsVoice
		} else {
			// for firefox
			initTtsVoice()
		}
	})

	logger.debug("Subscribing local storage settings synchers", LogCategory.INIT)
	// note: svelte stores subscribe method triggers the callback. 
	// This means that the callback is executed even if the store value didn't change
	displayComponentsLabels.subscribe(newValue => storage.set("displayComponentsLabels", newValue))
	displayBussesLabels.subscribe(newValue => storage.set("displayBussesLabels", newValue))
	displayStepText.subscribe(newValue => storage.set("displayStepText", newValue))
	animationSpeed.subscribe(newValue => storage.set("animationSpeed", newValue))
	language.subscribe(newValue => storage.set("language", newValue))
	ttsEnabled.subscribe(newValue => storage.set("ttsEnabled", newValue))
	ttsSpeed.subscribe(newValue => storage.set("ttsSpeed", newValue))
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
	logger.debug("Local storage settings synchers subscribed", LogCategory.INIT)

	logger.debug("Settings initialized", LogCategory.INIT)
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
