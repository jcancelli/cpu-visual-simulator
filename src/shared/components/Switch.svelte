<script lang="ts">
	import { Switch } from "@rgossiaux/svelte-headlessui"

	export let checked: boolean = false
	export let disabled: boolean = false
</script>

<Switch
	bind:checked
	bind:disabled
	on:change={e => (checked = !checked)}
	class="
        w-14
        h-6
        flex
        items-center
        flex-shrink-0
        rounded-2xl
        {disabled ? 'cursor-default' : 'cursor-pointer'}
        {checked ? 'bg-green-500' : 'bg-neutral-500'}
        {disabled ? 'brightness-[.6]' : ''}
        {$$restProps.class}
    "
>
	<span
		class="
            h-7
            w-7
            bg-neutral-100
            rounded-[50%]
            transition-transform
            shadow-lg
            {checked ? 'translate-x-8' : ''}
        "
	/>
</Switch>
