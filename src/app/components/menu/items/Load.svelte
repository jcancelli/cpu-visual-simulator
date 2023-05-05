<script lang="ts">
	import { ramStore, symbolTableStore } from "../../../store/state"
	import { parseProgram } from "../../../util/programParser"
	import logger, { LogCategory } from "../../../util/logger"
	import { messageFeedStore } from "../../../store/state"
	import { upload } from "../../../../shared/util/file"
	import MenuItemIcon from "../MenuItem.svelte"
	import text from "../../../store/text"

	async function loadProgram(): Promise<void> {
		try {
			const file = (await upload(".cpuvs"))[0]
			const program = parseProgram(await file.text())
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
			logger.debug("Program loaded from file", LogCategory.USER_INPUT)
		} catch (error) {
			logger.handled_error(error, LogCategory.USER_INPUT)
			$messageFeedStore.error(error.message)
		}
	}
</script>

<button on:click={loadProgram}>
	<MenuItemIcon text={$text.menu.buttons.load.text} title={$text.menu.buttons.load.title} icon="open" />
</button>
