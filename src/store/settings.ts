import { writable } from "svelte/store"
import { getDefaultLanguage } from "../resources/text"

export const displayAsBinary = writable(false)
export const displayLabels = writable(true)
export const playAnimations = writable(true)
export const animationSpeed = writable(1)
export const language = writable(getDefaultLanguage())
export const textToSpeech = writable(false)
