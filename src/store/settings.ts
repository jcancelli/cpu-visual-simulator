import { writable } from "svelte/store"

export const displayAsBinary = writable(false)
export const displayLabels = writable(true)
export const playAnimations = writable(true)
export const animationSpeed = writable(1)
