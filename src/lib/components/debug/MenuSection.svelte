<script lang="ts">
	export let title: string
</script>

<div class="flex flex-col">
	<h2 class="text-lg">{title}</h2>
	<div class="flex flex-col gap-2 pl-2">
		<slot />
	</div>
</div>
