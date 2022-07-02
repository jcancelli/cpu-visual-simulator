<script lang="ts">
	import { get } from "svelte/store"

	import CheckedError from "../../errors/CheckedError"

	import { messageFeed } from "../../store/components"

	import lang from "../../store/lang"
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
			$messageFeed.error(error.message)
		}
		Logger.info("Program loaded from file", "USER_INPUT")
	}

	function saveProgram() {
		try {
			let fileName = prompt("File name")
			if (fileName) {
				download(save(), `${fileName}.cpuvs`)
			} else {
				throw new CheckedError(get(lang).errors.user_input.invalid_file_name)
			}
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.error(error.message)
		}

		Logger.info("Program saved to file", "USER_INPUT")
	}
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-1 z-[4]">
	<Button icon="settings" title={$lang.menu.buttons.settings.title} />
	<Button icon="save" title={$lang.menu.buttons.save.title} on:click={saveProgram} />
	<Button icon="open" title={$lang.menu.buttons.open.title} on:click={loadProgram} />
	<Button icon="language" title={$lang.menu.buttons.language.title} />
	<Button icon="help" title={$lang.menu.buttons.help.title} />
</div>
