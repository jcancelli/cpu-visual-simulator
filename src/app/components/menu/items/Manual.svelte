<script lang="ts">
	import logger, { LogCategory } from "../../../util/logger"
	import MenuItemIcon from "../MenuItem.svelte"
	import text from "../../../store/text"

	function openManualPage(): void {
		window.open("manual", "_blank").focus()
		logger.debug("Manual opened", LogCategory.USER_INPUT)
	}
</script>

<button on:click={openManualPage}>
	<MenuItemIcon text={$text.menu.buttons.manual.text} title={$text.menu.buttons.manual.title} icon="manual" />
</button>
