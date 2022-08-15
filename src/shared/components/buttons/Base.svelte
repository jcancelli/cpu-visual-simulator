<script lang="ts">
	export let disabled = false
</script>

<button
	class="
        text-black
        border-2
        border-gray-600
        px-2
        rounded-md
        hover:text-white
        hover:bg-gray-600
        transition-colors
        disabled:brightness-[.6]
        disabled:cursor-default
        active:brightness-90
        {$$restProps.class}
    "
	on:click
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
>
	<slot />
</button>
