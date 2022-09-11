import App from "./App.svelte"
import Cpu from "./model/Cpu"
import Ram from "./model/Ram"
import cpu from "./store/cpu"
import ram from "./store/ram"
import { init as initSettings } from "./store/settings"
import { init as initText } from "./store/text"

ram.set(new Ram())
cpu.set(new Cpu())
initSettings()
initText()

export default new App({
	target: document.body
})
