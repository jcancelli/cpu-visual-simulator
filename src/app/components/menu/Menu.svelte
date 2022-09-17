<script lang="ts">
	import { get } from "svelte/store"
	import CheckedError from "../../errors/CheckedError"
	import { messageFeed } from "../../store/components"
	import text from "../../store/text"
	import { ramStore, symbolTableStore } from "../../store/state"
	import { showSettings } from "../../store/settings"
	import { download, upload } from "../../../shared/util/file"
	import Logger from "../../util/logger"
	import { parseProgram, exportProgram } from "../../util/programParser"
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
	import MenuItemIcon from "./MenuItem.svelte"

	const examples = [
		{
			id: "if_then_else",
			url: "resources/examples/if_then_else.cpuvs"
		},
		{
			id: "while_do",
			url: "resources/examples/while_do.cpuvs"
		},
		{
			id: "array_sum",
			url: "resources/examples/array_sum.cpuvs"
		}
	] as const

	function openSettings(): void {
		$showSettings = true
		Logger.info("Settings opened", "USER_INPUT")
	}

	async function loadProgram(): Promise<void> {
		try {
			const file = (await upload(".cpuvs"))[0]
			const program = parseProgram(await file.text())
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.error(error.message)
		}
		Logger.info("Program loaded from file", "USER_INPUT")
	}

	async function loadExample(exampleUrl: string): Promise<void> {
		try {
			const example = await fetch(exampleUrl).then(res => res.text())
			const program = parseProgram(example)
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.error(error.message)
		}
		Logger.info(`Example ${exampleUrl} loaded`, "USER_INPUT")
	}

	function saveProgram(): void {
		try {
			let fileName = prompt("File name")
			if (fileName) {
				download(exportProgram(ramStore.get(), symbolTableStore.get()), `${fileName}.cpuvs`)
			} else {
				throw new CheckedError(get(text).errors.user_input.invalid_file_name)
			}
		} catch (error) {
			Logger.error(error, "USER_INPUT", error.isChecked)
			$messageFeed.error(error.message)
		}

		Logger.info("Program saved to file", "USER_INPUT")
	}

	function openDocsPage(): void {
		window.open("manual", "_blank").focus()
	}
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-2 z-[4]">
	<button on:click={openSettings}>
		<MenuItemIcon
			text={$text.menu.buttons.settings.text}
			title={$text.menu.buttons.settings.title}
			icon="settings"
		/>
	</button>
	<button on:click={saveProgram}>
		<MenuItemIcon text={$text.menu.buttons.save.text} title={$text.menu.buttons.save.title} icon="save" />
	</button>
	<button on:click={loadProgram}>
		<MenuItemIcon text={$text.menu.buttons.load.text} title={$text.menu.buttons.load.title} icon="open" />
	</button>
	<Menu>
		<MenuButton>
			<MenuItemIcon
				text={$text.menu.buttons.examples.text}
				title={$text.menu.buttons.examples.title}
				icon="examples"
			/>
		</MenuButton>
		<MenuItems
			class="absolute flex flex-col mt-1 bg-neutral-500 border-2 border-neutral-800 shadow-lg rounded-md"
		>
			{#each examples as example}
				<MenuItem
					class="
						bg-neutral-500
						text-gray-200
						text-sm
						py-1
						px-2
						border-b-2
						border-neutral-700
						first:rounded-t-md
						last:border-0
						last:rounded-b-md
						hover:brightness-[.93]
						active:brightness-[.80]
					"
					title={$text.menu.buttons.examples.examples[example.id].title}
				>
					<button class="text-base leading-none" on:click={() => loadExample(example.url)}>
						{$text.menu.buttons.examples.examples[example.id].text}
					</button>
				</MenuItem>
			{/each}
		</MenuItems>
	</Menu>
	<button on:click={openDocsPage}>
		<MenuItemIcon
			text={$text.menu.buttons.manual.text}
			title={$text.menu.buttons.manual.title}
			icon="manual"
		/>
	</button>
</div>
