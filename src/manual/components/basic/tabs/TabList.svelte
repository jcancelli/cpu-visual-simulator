<script lang="ts">
	import { TabList } from "@rgossiaux/svelte-headlessui"
</script>

<TabList class="flex flex-col {$$props.class}">
	<slot />
</TabList>
