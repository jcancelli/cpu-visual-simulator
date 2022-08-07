<script lang="ts">
	export let disabled = false
</script>

<button
	class="
        text-black
        font-medium
        border
        border-black
        border-t-0
        bg-neutral-400
        px-2
        pb-1
        tracking-wider
        rounded-b-md
        shadow-md
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
