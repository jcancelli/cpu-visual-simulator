<script lang="ts">
	import { get } from "svelte/store"

	import CheckedError from "../../errors/CheckedError"

	import { messageFeed } from "../../store/components"

	import texts from "../../store/text"
	import { download, upload } from "../../util/fileUtil"
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
		Logger.info("Program loaded from file", "USER_INPUT")
	}

	function saveProgram() {
		try {
			let fileName = prompt("File name")
			if (fileName) {
				download(save(), `${fileName}.cpuvs`)
			} else {
				throw new CheckedError(get(texts).errors.user_input.invalid_file_name)
			}
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.message("ERROR", error.message)
		}

		Logger.info("Program saved to file", "USER_INPUT")
	}
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-1 z-[4]">
	<Button icon="settings" title={$texts.menu.buttons.settings.title} />
	<Button icon="save" title={$texts.menu.buttons.save.title} on:click={saveProgram} />
	<Button icon="open" title={$texts.menu.buttons.open.title} on:click={loadProgram} />
	<Button icon="language" title={$texts.menu.buttons.language.title} />
	<Button icon="help" title={$texts.menu.buttons.help.title} />
</div>
