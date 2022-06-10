<script lang="ts">
	import { onMount } from "svelte"
	import { logsStore, loggerStore } from "../store/logStore"
	import { download } from "../util/fileUtil"
	import { Log, LogGroup, LogGroups, LogType, LogTypes } from "../util/Logger"

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
</script>

{#if $loggerStore.showLogger}
	<div class="logger">
		<div class="header">
			<h2>Logs</h2>
			<div class="options filters">
				<label for="keyword">
					Keyword:
					<input type="text" bind:value={keyword} />
				</label>
				<label for="type">
					Type:
					<select id="type" bind:value={type}>
						<option value="ALL">ALL</option>
						{#each LogTypes as LogType}
							<option value={LogType}>{LogType}</option>
						{/each}
					</select>
				</label>
				<label for="group">
					Group:
					<select id="group" bind:value={group}>
						<option value="ALL">ALL</option>
						{#each LogGroups as LogGroup}
							<option value={LogGroup}>{LogGroup}</option>
						{/each}
					</select>
				</label>
			</div>
			<div class="options visualization">
				<label for="lock-scroll-to-bottom">
					Lock scroll to bottom
					<input type="checkbox" id="lock-scroll-to-bottom" bind:checked={lockScrollToBottom} />
				</label>
				<label for="show-timestamp">
					Show timestamp
					<input type="checkbox" id="show-timestamp" bind:checked={showTimestamp} />
				</label>
			</div>
			<div class="options">
				<button
					on:click={() =>
						download(
							JSON.stringify($logsStore),
							`cpu-visual-simultor-logs-${new Date().toDateString()}.json`
						)}>Export</button
				>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="white"
				height="30px"
				width="30px"
				on:click={toggle}
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<div class="logs" bind:this={logsDiv}>
			{#each logs as log}
				<p class="log {log.logType}">
					{#if showTimestamp}{log.timestamp} - {/if}{log.message}
				</p>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.logger {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1000;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-around;
		gap: 1rem;
		padding: 1rem;
	}

	h2 {
		font-size: large;
	}

	.options {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 0.5rem;
		border: 1px solid rgba(0, 0, 0, 0.4);
	}

	.logs {
		width: 100%;
		height: 90%;
		overflow-y: auto;
	}

	.log {
		margin: 8px;
		white-space: pre-line;

		&.UNCHECKED_ERROR {
			color: red;
			background-color: rgba(0, 0, 0, 0.4);
		}

		&.CHECKED_ERROR {
			color: gold;
			background-color: rgba(0, 0, 0, 0.4);
		}

		&.DEBUG {
			color: cyan;
		}
	}
</style>
