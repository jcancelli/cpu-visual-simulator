<script lang="ts">
	import Widget from "../Widget.svelte"
	import LanguageSelect from "../../../../shared/components/LanguageSelect.svelte"
	import text from "../../../store/text"
	import {
		language,
		displayComponentsLabels,
		displayBussesLabels,
		displayStepText
	} from "../../../store/settings"
	import Toggle from "../../basic/checkboxes/Settings.svelte"
</script>

<Widget title={$text.settings.language.title} description={$text.settings.language.description}>
	<LanguageSelect bind:value={$language} />
</Widget>
<Widget
	title={$text.settings.dispaly_components_labels.title}
	description={$text.settings.dispaly_components_labels.description}
>
	<Toggle bind:checked={$displayComponentsLabels} />
</Widget>
<Widget
	title={$text.settings.dispaly_busses_labels.title}
	description={$text.settings.dispaly_busses_labels.description}
>
	<Toggle bind:checked={$displayBussesLabels} />
</Widget>
<Widget
	title={$text.settings.display_step_text.title}
	description={$text.settings.display_step_text.description}
>
	<Toggle bind:checked={$displayStepText} />
</Widget>
