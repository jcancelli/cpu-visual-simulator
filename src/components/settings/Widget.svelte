<script lang="ts">
	export let title = ""
	export let description = ""
</script>

<div class="w-full flex flex-row items-center justify-between border-b border-neutral-500 p-3 pl-11 pr-24">
	<div class="flex flex-col">
		<h2 class="text-2xl font-bold">{title}</h2>
		<p class="text-sm text-neutral-500">{description}</p>
	</div>
	<slot />
</div>
