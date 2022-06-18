<script lang="ts">
	export let disabled = false
	export let title = ""
</script>

<button
	class="
        flex
        items-center
        justify-center
        w-9
        h-9
        border
        border-black
        rounded-md
        bg-white
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
	{title}
>
	<slot />
</button>
