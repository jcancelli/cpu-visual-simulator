<script lang="ts">
    export let value = ""
	export let placeholder = ""
	export let disabled = false
    export let type: "text" | "number" = "text"

    function typeAction(node: HTMLInputElement) {
        node.type = type
    }
</script>

<input	
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
    type="text"
    on:input
    on:change
    on:focus
    on:focusout
    on:mouseenter
	on:mouseleave
	on:mouseover
    bind:value
	{placeholder}
	{disabled}
    use:typeAction
/>
