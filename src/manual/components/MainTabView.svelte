<script lang="ts">
	import TabGroup from "../../shared/components/tabs/TabGroup.svelte"
	import TabList from "../../shared/components/tabs/TabList.svelte"
	import Tab from "../../shared/components/tabs/Tab.svelte"
	import TabPanels from "../../shared/components/tabs/TabPanels.svelte"
	import TabPanel from "../../shared/components/tabs/TabPanel.svelte"
	import text from "../stores/text"
	import InstructionSetSection from "./sections/InstructionSet.svelte"
</script>

<TabGroup class="p-5">
	<TabList class="mt-4">
		<Tab class="border-t border-t-gray-500">{$text.sections.instruction_set.title}</Tab>
		<Tab>{$text.sections.ui.title}</Tab>
		<Tab>{$text.sections.controls.title}</Tab>
		<Tab>{$text.sections.examples.title}</Tab>
		<Tab>{$text.sections.credits.title}</Tab>
	</TabList>
	<TabPanels>
		<TabPanel>
			<InstructionSetSection />
		</TabPanel>
		<TabPanel>
			<h1 class="text-center font-bold text-4xl">TODO</h1>
		</TabPanel>
		<TabPanel>
			<h1 class="text-center font-bold text-4xl">TODO</h1>
		</TabPanel>
		<TabPanel>
			<h1 class="text-center font-bold text-4xl">TODO</h1>
		</TabPanel>
		<TabPanel>
			<h1 class="text-center font-bold text-4xl">TODO</h1>
		</TabPanel>
	</TabPanels>
</TabGroup>
