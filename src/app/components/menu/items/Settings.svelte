<script lang="ts">
	import MenuItem from "../MenuItem.svelte"
	import logger, { LogCategory } from "../../../util/logger"
	import text from "../../../store/text"
	import { showSettings } from "../../../store/settings"

	function openSettings(): void {
		$showSettings = true
		logger.debug("Settings opened", LogCategory.USER_INPUT)
	}
</script>

<button on:click={openSettings}>
	<MenuItem
		text={$text.menu.buttons.settings.text}
		title={$text.menu.buttons.settings.title}
		icon="settings"
	/>
</button>
