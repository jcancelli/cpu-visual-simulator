<script lang="ts">
	import texts from "../../store/text"
	import Button from "../basic/buttons/Menu.svelte"

	let expanded = false
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-1 z-[4]">
	<Button icon="settings" title={$texts.menu.buttons.settings.title} />
	<Button icon="save" title={$texts.menu.buttons.save.title} />
	<Button icon="open" title={$texts.menu.buttons.open.title} />
	<Button icon="language" title={$texts.menu.buttons.language.title} />
	<Button icon="help" title={$texts.menu.buttons.help.title} />
</div>
