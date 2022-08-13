<script lang="ts">
	import { TabPanel } from "@rgossiaux/svelte-headlessui"
</script>

<TabPanel class={$$props.class}>
	<slot />
</TabPanel>
