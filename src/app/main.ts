import App from "./App.svelte"
import { init as initSettings } from "./store/settings"
import { init as initText } from "./store/text"

initSettings()
initText()

export default new App({
	target: document.body
})
