<script lang="ts">
	export let title = ""
</script>

<div class="flex flex-col items-center gap-1.5 max-w-[250px]">
	<h2 class="text-lg mx-auto">{title}</h2>
	<div class="w-full flex flex-col items-center gap-0.5">
		<slot name="inputs" />
	</div>
	<div class="w-full flex flex-wrap justify-center gap-1">
		<slot name="buttons" />
	</div>
</div>
