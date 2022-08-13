<script lang="ts">
	import { TabGroup } from "@rgossiaux/svelte-headlessui"
</script>

<TabGroup class="grid grid-cols-tabgroup gap-x-4 {$$props.class}" vertical>
	<slot />
</TabGroup>
