import { writable } from "../util/customStores"
import Cpu from "../model/Cpu"

const cpu = writable<Cpu>()

export default cpu
