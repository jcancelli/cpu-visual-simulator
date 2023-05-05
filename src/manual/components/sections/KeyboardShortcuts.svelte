<script lang="ts">
	import text from "../../stores/text"
	import Section from "../Section.svelte"
</script>

<Section title={"Keyboard shortcuts"} h={2}>
	<table class="text-center border-collapse shadow-lg {$$props.class}">
		<tr class="bg-gray-400">
			<th colspan="3">RAM Editing</th>
		</tr>
		<!-- colgroup is in this position the last-child and first-child selectors works properly -->
		<colgroup>
			<col class="w-44 rounded-t" />
			<col class="w-32" />
			<col class="w-[37rem] text-left" />
		</colgroup>
		<tr class="bg-gray-400">
			<th>Keys</th>
			<th>Condition</th>
			<th class="text-left">Description</th>
		</tr>
		<tr class="bg-gray-200">
			<td>ENTER</td>
			<td>No cell is selected</td>
			<td class="text-left">Select the first visible cell.</td>
		</tr>
		<tr class="bg-gray-200">
			<td>ENTER</td>
			<td>A cell/label is selected</td>
			<td class="text-left">Deselect the selected address and write its content to RAM.</td>
		</tr>
		<tr class="bg-gray-200">
			<td>ARROW UP</td>
			<td>A cell/label is selected</td>
			<td class="text-left">Move the selection up by one cell.</td>
		</tr>
		<tr class="bg-gray-200">
			<td>ARROW DOWN</td>
			<td>A cell/label is selected</td>
			<td class="text-left">Move the selection down by one cell.</td>
		</tr>
		<tr class="bg-gray-200">
			<td>SHIFT + ARROW UP</td>
			<td>A cell/label is selected</td>
			<td class="text-left">
				All cells above the selected address (included) are shifted up by one. The content of the first
				address is lost and "NOP" is inserted at the selected address.
			</td>
		</tr>
		<tr class="bg-gray-200">
			<td>SHIFT + ARROW DOWN</td>
			<td>A cell/label is selected</td>
			<td class="text-left">
				All cells above the selected address are shifted down by one. The content of the selected address is
				overwritten and "NOP" is inserted at the first address.
			</td>
		</tr>
		<tr class="bg-gray-200">
			<td>CTRL + ARROW UP</td>
			<td>A cell/label is selected</td>
			<td class="text-left">
				All cells below the selected address are shifted up by one. The content of the selected address is
				overwritten and "NOP" is inserted at the last address.
			</td>
		</tr>
		<tr class="bg-gray-200">
			<td>CTRL + ARROW DOWN</td>
			<td>A cell/label is selected</td>
			<td class="text-left">
				All cells below the selected address (included) are shifted down by one. The content of the last
				address is overwritten and "NOP" is inserted at the selected address.
			</td>
		</tr>
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
