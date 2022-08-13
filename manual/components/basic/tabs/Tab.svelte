<script lang="ts">
	import { Tab } from "@rgossiaux/svelte-headlessui"
</script>

<Tab let:selected>
	<div
		class="
            pl-4
            py-2
            border-l-4
            border-b
            border-b-gray-500
            text-left
            hover:text-blue-500
            {selected ? 'border-l-blue-500 text-blue-500 font-bold' : 'border-l-transparent'}
            {$$props.class}
        "
	>
		<slot />
	</div>
</Tab>
