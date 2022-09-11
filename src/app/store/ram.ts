import { writable } from "../util/customStores"
import Ram from "../model/Ram"

const ram = writable<Ram>()

export default ram
