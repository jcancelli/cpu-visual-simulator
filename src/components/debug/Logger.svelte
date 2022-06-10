<script lang="ts">
	import { onMount } from "svelte"
	import { logsStore, loggerStore } from "../../store/logStore"
	import { download } from "../../util/fileUtil"
	import { Log, LogGroup, LogGroups, LogType, LogTypes } from "../../util/Logger"

	let logsDiv: HTMLDivElement
	let logs: Log[] = []
	let type: LogType | "ALL" = "ALL"
	let group: LogGroup | "ALL" = "ALL"
	let keyword = ""
	let showTimestamp = false
	let lockScrollToBottom = true

	onMount(() => {
		const toggleShortcutListener = (e: KeyboardEvent) => {
			if (e.altKey && e.shiftKey && e.key.toLowerCase() === "l") {
				toggle()
			}
		}
		window.addEventListener("keydown", toggleShortcutListener)
		return () => window.removeEventListener("keydown", toggleShortcutListener)
	})

	$: {
		if (logsDiv) {
			logs = $logsStore.filter(
				log =>
					(type === "ALL" || log.logType === type) &&
					(group === "ALL" || log.logGroup === group) &&
					log.message.toLowerCase().includes(keyword)
			)
			if (lockScrollToBottom) {
				logsDiv.scrollTop = logsDiv.scrollHeight
			}
		}
	}

	function toggle() {
		loggerStore.updateShowLogger(oldValue => !oldValue)
	}

	function exportLogs() {
		download(
			JSON.stringify($logsStore),
			`cpu-visual-simultor-logs-${new Date().toDateString()}.json`
		)
	}
</script>

{#if $loggerStore.showLogger}
	<div class="fixed top-0 left-0 w-screen h-screen z-[1000] bg-black/70 text-white">
		<div class="flex flex-wrap items-center justify-around gap-4 p-4">
			<h2 class="text-2xl">Logs</h2>
			<div class="flex items-center flex-wrap gap-4 p-2">
				<label for="keyword">
					Keyword:
					<input type="text" bind:value={keyword} class="text-black px-1 py-0.5" />
				</label>
				<label for="type">
					Type:
					<select id="type" bind:value={type} class="text-black px-1 py-0.5">
						<option value="ALL">ALL</option>
						{#each LogTypes as LogType}
							<option value={LogType}>{LogType}</option>
						{/each}
					</select>
				</label>
				<label for="group">
					Group:
					<select id="group" bind:value={group} class="text-black px-1 py-0.5">
						<option value="ALL">ALL</option>
						{#each LogGroups as LogGroup}
							<option value={LogGroup}>{LogGroup}</option>
						{/each}
					</select>
				</label>
			</div>
			<div class="flex items-center flex-wrap gap-4 p-2">
				<label for="lock-scroll-to-bottom">
					Lock scroll to bottom
					<input type="checkbox" id="lock-scroll-to-bottom" bind:checked={lockScrollToBottom} />
				</label>
				<label for="show-timestamp">
					Show timestamp
					<input type="checkbox" id="show-timestamp" bind:checked={showTimestamp} />
				</label>
			</div>
			<div class="flex items-center flex-wrap gap-4 p-2">
				<button on:click={exportLogs} class="border px-1">Export</button>
			</div>
			<button on:click={toggle} title="Close logs">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-7 w-7 fill-white">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		<div class="w-full h-[90%] overflow-y-auto" bind:this={logsDiv}>
			{#each logs as log}
				<p class="m-2 whitespace-pre-line {log.logType}">
					{#if showTimestamp}{log.timestamp} - {/if}{log.message}
				</p>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.UNCHECKED_ERROR {
		color: red;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.CHECKED_ERROR {
		color: gold;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.DEBUG {
		color: cyan;
	}
</style>
