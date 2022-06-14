<script lang="ts">
	export let value = ""
	export let disabled = false
</script>

<select
	class="
        bg-transparent
        border-2
        border-white
        text-white
        rounded-md
        px-1
        disabled:brightness-[.6]
        {$$restProps.class}
    "
	on:input
	on:change
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	bind:value
	{disabled}
>
	<slot />
</select>
