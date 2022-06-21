<script lang="ts">
	import { messageFeed } from "../../store/components"

	import texts from "../../store/text"
	import { upload } from "../../util/fileUtil"
	import Logger from "../../util/Logger"
	import { load, save } from "../../util/programLoader"
	import Button from "../basic/buttons/Menu.svelte"

	async function loadProgram() {
		try {
			const file = (await upload(".cpuvs"))[0]
			load(await file.text())
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.message("ERROR", error.message)
		}
	}
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-1 z-[4]">
	<Button icon="settings" title={$texts.menu.buttons.settings.title} />
	<Button icon="save" title={$texts.menu.buttons.save.title} on:click={save} />
	<Button icon="open" title={$texts.menu.buttons.open.title} on:click={loadProgram} />
	<Button icon="language" title={$texts.menu.buttons.language.title} />
	<Button icon="help" title={$texts.menu.buttons.help.title} />
</div>
