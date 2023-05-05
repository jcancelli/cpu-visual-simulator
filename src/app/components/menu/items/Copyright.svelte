<script lang="ts">
	import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui"
	import MenuItem from "../MenuItem.svelte"
	import CloseButton from "../../../../shared/components/buttons/CloseButton.svelte"
	import logger, { LogCategory } from "../../../util/logger"
	import text from "../../../store/text"
	import CopyrightNotice from "../../dialogs/CopyrightNotice.svelte"

	let showDialog = false

	function openDialog(): void {
		showDialog = true
		logger.debug("Copyright notice opened", LogCategory.USER_INPUT)
	}

	function closeDialog(): void {
		showDialog = false
		logger.debug("Copyright notice closed", LogCategory.USER_INPUT)
	}
</script>

<button on:click={openDialog}>
	<MenuItem
		text={$text.menu.buttons.copyright.text}
		title={$text.menu.buttons.copyright.title}
		icon="copyright"
	/>
</button>

<CopyrightNotice open={showDialog} on:close={closeDialog} />
