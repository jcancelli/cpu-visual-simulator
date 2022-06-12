<script lang="ts">
	export let placeholder = ""
	export let disabled = false
</script>

<input
	type="text"
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
	{placeholder}
	{disabled}
/>
