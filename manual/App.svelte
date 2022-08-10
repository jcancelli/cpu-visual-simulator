<script lang="ts">
	import OpcodesTable from "./components/OpcodesTable.svelte"
	import text from "./stores/text"
</script>

<h1>{$text.title}</h1>

<OpcodesTable />

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
