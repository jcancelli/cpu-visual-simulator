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

<button
	class="
        text-white
        border
        border-white
        px-2
        rounded-md
        transition-colors
        disabled:brightness-[.6]
        disabled:cursor-default
        active:brightness-90
        {checked ? 'text-black bg-white' : ''}
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
	<slot />
</button>
