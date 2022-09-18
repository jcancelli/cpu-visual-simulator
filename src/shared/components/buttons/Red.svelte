<script lang="ts">
	export let disabled = false
</script>

<button
	class="
        text-black
        border-2
        border-red-700
        px-2
        rounded-md
        hover:text-white
        focus:text-white
        hover:bg-red-700
        focus:bg-red-700
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
