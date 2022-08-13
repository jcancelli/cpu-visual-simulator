<script lang="ts">
	import Header from "./components/Header.svelte"
	import MainTabView from "./components/MainTabView.svelte"
</script>

<Header />
<main>
	<MainTabView />
</main>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
