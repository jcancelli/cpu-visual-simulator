import { writable } from "svelte/store"
import Ram from "../model/Ram"

const ram = writable<Ram>()

export default ram
