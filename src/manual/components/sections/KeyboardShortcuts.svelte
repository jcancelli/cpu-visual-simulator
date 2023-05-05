<script lang="ts">
	import text from "../../stores/text"
	import Section from "../Section.svelte"
</script>

<Section title={"Keyboard shortcuts"} h={2}>
	<table class="text-center border-collapse shadow-lg {$$props.class}">
		<tr class="bg-gray-400">
			<th colspan="3">
				{$text.shortcuts_table.ram_editing.title}
			</th>
		</tr>
		<!-- colgroup is in this position the last-child and first-child selectors works properly -->
		<colgroup>
			<col class="w-44 rounded-t" />
			<col class="w-32" />
			<col class="w-[37rem] text-left" />
		</colgroup>
		<tr class="bg-gray-400">
			<th>
				{$text.shortcuts_table.ram_editing.headers.keys}
			</th>
			<th>
				{$text.shortcuts_table.ram_editing.headers.condition}
			</th>
			<th class="text-left">
				{$text.shortcuts_table.ram_editing.headers.description}
			</th>
		</tr>
		{#each $text.shortcuts_table.ram_editing.shortcuts as shortcut}
			<tr class="bg-gray-200">
				<td>{shortcut.keys}</td>
				<td>{shortcut.condition}</td>
				<td class="text-left">{shortcut.description}</td>
			</tr>
		{/each}
	</table>
</Section>

<style>
	td,
	th {
		padding: 0.5rem 1rem;
		border-bottom: 0.05em solid black;
	}

	tr:first-child th {
		border-top-left-radius: 0.7rem;
		border-top-right-radius: 0.7rem;
	}

	tr:last-child td {
		border: 0;
	}

	tr:last-child td:first-child {
		border-bottom-left-radius: 0.5rem;
	}

	tr:last-child td:last-child {
		border-bottom-right-radius: 0.5rem;
	}
</style>
