<script lang="ts">
	import OpcodesTable from "./components/OpcodesTable.svelte"
	import text from "./stores/text"
</script>

<header class="p-4">
	<h1 class="text-5xl font-bold">{$text.title}</h1>
</header>
<main class="flex flex-col items-center">
	<OpcodesTable />
</main>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
