<script lang="ts">
	import { displayStepText, language } from "../../store/settings"

	import Widget from "./Widget.svelte"

	let text = ""

	language.subscribe(() => setText(""))

	export function setText(txt: string) {
		text = txt
	}
</script>

{#if $displayStepText}
	<Widget class="justify-center">
		<p class="w-[450px] text-gray-200 overflow-hidden text-center">
			{text}
		</p>
	</Widget>
{/if}
