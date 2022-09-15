import Ram from "../model/Ram"
import { writable } from "../util/customStores"

export const ramStore = writable<Ram>()
