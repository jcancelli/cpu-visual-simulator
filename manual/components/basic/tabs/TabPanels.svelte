<script lang="ts">
	import { TabPanels } from "@rgossiaux/svelte-headlessui"
</script>

<TabPanels class={$$props.class}>
	<slot />
</TabPanels>
