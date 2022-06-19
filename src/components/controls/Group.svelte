<script lang="ts">
	export let label = ""
</script>

<div class="h-full py-2 flex flex-col items-center justify-between">
	<span class="text-gray-200">{label}</span>
	<slot />
</div>
