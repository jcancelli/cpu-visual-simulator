<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let disabled = false
	export let checked = false

	const dispatch = createEventDispatcher()

	function handleClick(e) {
		checked = !checked
		dispatch("click", e)
	}
</script>

<div
	class="       
        w-14
        h-7
        rounded-2xl
        p-[2px]
        box-content
        flex
        items-center
        flex-shrink-0
        {disabled ? 'cursor-default' : 'cursor-pointer'}
        {checked ? 'bg-green-500' : 'bg-neutral-500'}
        {disabled ? 'brightness-[.6]' : ''}
        {$$restProps.class}
    "
	on:click={handleClick}
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
>
	<div
		class="
            h-7
            w-7
            bg-neutral-100
            rounded-2xl
            transition-transform
            shadow-lg
            {checked ? 'translate-x-full' : ''}
        "
	/>
</div>
