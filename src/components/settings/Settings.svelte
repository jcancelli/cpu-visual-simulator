<script lang="ts">
	import lang from "../../store/lang"
	import {
		availableTextToSpeechVoices,
		displayLabels,
		language,
		showSettings,
		SUPPORTED_LANGS,
		textToSpeechEnabled,
		textToSpeechSpeed,
		textToSpeechVoice
	} from "../../store/settings"
	import Logger from "../../util/Logger"
	import CloseButton from "../basic/buttons/close/Settings.svelte"
	import Widget from "./Widget.svelte"
	import { fade } from "svelte/transition"
	import Toggle from "../basic/checkboxes/Settings.svelte"
	import Select from "../basic/selects/Settings.svelte"
	import Slider from "../basic/slider/Settings.svelte"

	function closeSettings() {
		$showSettings = false
		Logger.info("Settings closed", "USER_INPUT")
	}
</script>

{#if $showSettings}
	<div class="fixed w-screen h-screen top-0 left-0 bg-gray-100" transition:fade={{ duration: 75 }}>
		<div class="w-full flex flex-row items-center justify-between pt-3 pb-5 px-9 border-b border-neutral-500">
			<h1 class="text-[2.8rem] font-bold">{$lang.settings.title}</h1>
			<CloseButton on:click={closeSettings} />
		</div>
		<div class="w-full flex flex-col">
			<Widget title={$lang.settings.language.title} description={$lang.settings.language.description}>
				<Select options={[...SUPPORTED_LANGS]} bind:value={$language} />
			</Widget>
			<Widget
				title={$lang.settings.dispaly_labels.title}
				description={$lang.settings.dispaly_labels.description}
			>
				<Toggle bind:checked={$displayLabels} />
			</Widget>
			<Widget title={$lang.settings.tts_enabled.title} description={$lang.settings.tts_enabled.description}>
				<Toggle bind:checked={$textToSpeechEnabled} />
			</Widget>
			<Widget title={$lang.settings.tts_speed.title} description={$lang.settings.tts_speed.description}>
				<div class="w-36 flex flex-col items-center justify-center">
					<p>{$textToSpeechSpeed}</p>
					<Slider min={0.5} max={1.5} bind:value={$textToSpeechSpeed} />
				</div>
			</Widget>
			<Widget title={$lang.settings.tts_voice.title} description={$lang.settings.tts_voice.description}>
				<Select options={$availableTextToSpeechVoices.map(v => v.name)} bind:value={$textToSpeechVoice} />
			</Widget>
		</div>
	</div>
{/if}
