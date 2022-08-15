<script lang="ts">
	import LanguageSelect from "../../shared/components/selects/LanguageSelect.svelte"
	import { language } from "../stores/settings"
	import text from "../stores/text"
</script>

<header class="px-7 py-4 border-b border-gray-500 flex items-center justify-between">
	<h1 class="text-4xl font-bold text-left">{$text.title}</h1>
	<LanguageSelect bind:value={$language} />
</header>
