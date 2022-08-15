<script lang="ts">
	import Widget from "../Widget.svelte"
	import LanguageSelect from "../../../../shared/components/selects/LanguageSelect.svelte"
	import text from "../../../store/text"
	import {
		language,
		displayComponentsLabels,
		displayBussesLabels,
		displayStepText,
		reset
	} from "../../../store/settings"
	import Switch from "../../../../shared/components/Switch.svelte"
	import RedButton from "../../../../shared/components/buttons/Red.svelte"
</script>

<Widget title={$text.settings.language.title} description={$text.settings.language.description}>
	<LanguageSelect bind:value={$language} />
</Widget>
<Widget
	title={$text.settings.dispaly_components_labels.title}
	description={$text.settings.dispaly_components_labels.description}
>
	<Switch bind:checked={$displayComponentsLabels} />
</Widget>
<Widget
	title={$text.settings.dispaly_busses_labels.title}
	description={$text.settings.dispaly_busses_labels.description}
>
	<Switch bind:checked={$displayBussesLabels} />
</Widget>
<Widget
	title={$text.settings.display_step_text.title}
	description={$text.settings.display_step_text.description}
>
	<Switch bind:checked={$displayStepText} />
</Widget>
<Widget title={$text.settings.reset_all.title} description={$text.settings.reset_all.description}>
	<RedButton on:click={reset}>{$text.settings.reset_all.button.text}</RedButton>
</Widget>
