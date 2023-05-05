<script lang="ts">
	import text from "../../../store/text"
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
	import MenuItemIcon from "../MenuItem.svelte"
	import SaveToFileDialog from "../../dialogs/SaveProgramToFile.svelte"
	import SaveToUrlDialog from "../../dialogs/SaveProgramToUrl.svelte"

	let showSaveToFileDialog = false
	let showSaveToUrlDialog = false

	function openSaveToFileDialog(): void {
		showSaveToFileDialog = true
	}

	function closeSaveToFileDialog(): void {
		showSaveToFileDialog = false
	}

	function openSaveToUrlDialog(): void {
		showSaveToUrlDialog = true
	}

	function closeSaveToUrlDialog(): void {
		showSaveToUrlDialog = false
	}
</script>

<Menu>
	<MenuButton>
		<MenuItemIcon text={$text.menu.buttons.save.text} title={$text.menu.buttons.save.title} icon="save" />
	</MenuButton>
	<MenuItems
		class="absolute flex flex-col mt-1 bg-neutral-500 border-2 border-neutral-800 shadow-lg rounded-md"
	>
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
			title={$text.menu.buttons.save.save_to_file.title}
		>
			<button class="text-base leading-none" on:click={openSaveToFileDialog}>
				{$text.menu.buttons.save.save_to_file.text}
			</button>
		</MenuItem>
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
			title={$text.menu.buttons.save.save_to_url.title}
		>
			<button class="text-base leading-none" on:click={openSaveToUrlDialog}>
				{$text.menu.buttons.save.save_to_url.text}
			</button>
		</MenuItem>
	</MenuItems>
</Menu>

<SaveToFileDialog open={showSaveToFileDialog} on:close={closeSaveToFileDialog} />
<SaveToUrlDialog open={showSaveToUrlDialog} on:close={closeSaveToUrlDialog} />
