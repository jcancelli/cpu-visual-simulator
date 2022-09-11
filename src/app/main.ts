import App from "./App.svelte"
import Ram from "./model/Ram"
import ram from "./store/ram"
import { init as initSettings } from "./store/settings"
import { init as initText } from "./store/text"

ram.set(new Ram())
initSettings()
initText()

export default new App({
	target: document.body
})
