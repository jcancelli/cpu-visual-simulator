import { Language } from "../../shared/util/i18n"
import { LocalStorage } from "../../shared/util/LocalStorage"

export type AppLocalStorage = {
	displayComponentsLabels: boolean
	displayBussesLabels: boolean
	displayStepText: boolean
	animationSpeed: number
	language: Language
	ttsEnabled: boolean
	ttsSpeed: number
	ttsVoice: string
	extDataBusColor: string
	intDataBusColor: string
	extDataBusAnimationColor: string
	intDataBusAnimationColor: string
	extAddressBusColor: string
	intAddressBusColor: string
	extAddressBusAnimationColor: string
	intAddressBusAnimationColor: string
	extControlBusColor: string
	intControlBusColor: string
	extControlBusAnimationColor: string
	intControlBusAnimationColor: string
	program: string
}

export const storage = new LocalStorage<AppLocalStorage>("app")
