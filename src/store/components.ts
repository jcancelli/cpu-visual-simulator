import { writable } from "svelte/store"
import Ram from "../components/ram/Ram.svelte"
import Cpu from "../components/cpu/Cpu.svelte"
import Wires from "../wires/Wires.svelte"
import Controls from "../components/controls/Controls.svelte"
import Debugger from "../components/debug/Debugger.svelte"
import MessageFeed from "../components/messages/Feed.svelte"
import Logger from "../components/debug/Logger.svelte"
import Menu from "../components/menu/Menu.svelte"
import StepText from "../components/controls/StepText.svelte"
import Settings from "../components/settings/Settings.svelte"

export const ram = writable<Ram>()
export const cpu = writable<Cpu>()
export const wires = writable<Wires>()
export const controls = writable<Controls>()
export const debug = writable<Debugger>()
export const messageFeed = writable<MessageFeed>()
export const logger = writable<Logger>()
export const menu = writable<Menu>()
export const stepText = writable<StepText>()
export const settings = writable<Settings>()
