<script lang="ts">
	import Header from "./components/Header.svelte"
	import MainTabView from "./components/MainTabView.svelte"
	import text from "./stores/text"
</script>

<svelte:head>
	<title>{$text.page_title} - CPU Visual Simulator</title>
</svelte:head>

<Header />
<main>
	<MainTabView />
</main>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
