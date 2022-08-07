<script lang="ts">
	import { get } from "svelte/store"
	import CheckedError from "../../errors/CheckedError"
	import { messageFeed } from "../../store/components"
	import lang from "../../store/lang"
	import ram from "../../store/ram"
	import { showSettings } from "../../store/settings"
	import symbolTable from "../../store/symbolTable"
	import { download, upload } from "../../util/fileUtil"
	import Logger from "../../util/logger"
	import { compileProgram, exportProgram } from "../../util/programLoader"
	import Button from "../basic/buttons/Menu.svelte"

	function openSettings() {
		$showSettings = true
		Logger.info("Settings opened", "USER_INPUT")
	}

	async function loadProgram() {
		try {
			const file = (await upload(".cpuvs"))[0]
			const program = compileProgram(await file.text())
			symbolTable.importLabels(program.labels)
			ram.importInstructions(program.instructions)
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
				download(exportProgram(ram.exportInstructions(), symbolTable.exportLabels()), `${fileName}.cpuvs`)
			} else {
				throw new CheckedError(get(lang).errors.user_input.invalid_file_name)
			}
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.error(error.message)
		}

		Logger.info("Program saved to file", "USER_INPUT")
	}

	function openDocsPage() {
		window.open("docs", "_blank").focus()
	}
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-1 z-[4]">
	<Button icon="settings" title={$lang.menu.buttons.settings.title} on:click={openSettings} />
	<Button icon="save" title={$lang.menu.buttons.save.title} on:click={saveProgram} />
	<Button icon="open" title={$lang.menu.buttons.open.title} on:click={loadProgram} />
	<Button icon="help" title={$lang.menu.buttons.help.title} on:click={openDocsPage} />
</div>
