import { writable } from "svelte/store"
import Ram from "../components/ram/Ram.svelte"
import Cpu from "../components/cpu/Cpu.svelte"
import Wires from "../wires/Wires.svelte"
import ControlBar from "../components/ControlBar.svelte"
import Debugger from "../components/debug/Debugger.svelte"
import MessageFeed from "../components/MessageFeed.svelte"
import Logger from "../components/debug/Logger.svelte"

export const ram = writable<Ram>()
export const cpu = writable<Cpu>()
export const wires = writable<Wires>()
export const controlBar = writable<ControlBar>()
export const debug = writable<Debugger>()
export const messageFeed = writable<MessageFeed>()
export const logger = writable<Logger>()

const components = {
	ram,
	cpu,
	wires,
	controlBar,
	debug,
	messageFeed
}

export default components
