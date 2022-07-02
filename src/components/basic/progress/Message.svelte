<script lang="ts">
	export let value
	export let max

	$: width = (100 / max) * value
</script>

<div class="w-full h-1 bg-transparent {$$restProps.class}">
	<div class="h-full bg-white/60 rounded-r-sm" style="width:{width}%" />
</div>
