import App from "./App.svelte"
import { init as initText } from "./stores/text"
import { init as initSettings } from "./stores/settings"

initSettings()
initText()

export default new App({
	target: document.body
})
