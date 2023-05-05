<script lang="ts">
	import Copyright from "./items/Copyright.svelte"
	import Settings from "./items/Settings.svelte"
	import Save from "./items/Save.svelte"
	import Load from "./items/Load.svelte"
	import Manual from "./items/Manual.svelte"
	import Examples from "./items/Examples.svelte"
</script>

<div class="absolute top-0 right-0 p-2 flex flex-row-reverse gap-2 z-[4]">
	<Copyright />
	<Settings />
	<Save />
	<Load />
	<Examples />
	<Manual />
</div>
