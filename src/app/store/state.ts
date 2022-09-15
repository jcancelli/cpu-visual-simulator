import { writable } from "../util/customStores"
import Cpu from "../model/Cpu"
import Ram from "../model/Ram"

export const ramStore = writable<Ram>()
export const cpuStore = writable<Cpu>()
