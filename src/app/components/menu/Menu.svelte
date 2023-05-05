<script lang="ts">
	import { messageFeedStore } from "../../store/state"
	import text from "../../store/text"
	import { ramStore, symbolTableStore } from "../../store/state"
	import { upload } from "../../../shared/util/file"
	import logger, { LogCategory } from "../../util/logger"
	import { parseProgram } from "../../util/programParser"
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
	import MenuItemIcon from "./MenuItem.svelte"
	import Copyright from "./items/Copyright.svelte"
	import Settings from "./items/Settings.svelte"
	import Save from "./items/Save.svelte"

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

	async function loadExample(exampleUrl: string): Promise<void> {
		try {
			const example = await fetch(exampleUrl).then(res => res.text())
			const program = parseProgram(example)
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
			logger.debug(`Example ${exampleUrl} loaded`, LogCategory.USER_INPUT)
		} catch (error) {
			logger.handled_error(error.message, LogCategory.USER_INPUT)
			$messageFeedStore.error(error.message)
		}
	}

	function openDocsPage(): void {
		window.open("manual", "_blank").focus()
		logger.debug("Manual opened", LogCategory.USER_INPUT)
	}
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-2 z-[4]">
	<Copyright />
	<Settings />
	<Save />

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
