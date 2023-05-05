<script lang="ts">
	import TabGroup from "../../shared/components/tabs/TabGroup.svelte"
	import TabList from "../../shared/components/tabs/TabList.svelte"
	import Tab from "../../shared/components/tabs/Tab.svelte"
	import TabPanels from "../../shared/components/tabs/TabPanels.svelte"
	import TabPanel from "../../shared/components/tabs/TabPanel.svelte"
	import text from "../stores/text"
	import InstructionSetSection from "./sections/InstructionSet.svelte"
	import Introduction from "./sections/Introduction.svelte"
	import Examples from "./sections/Examples.svelte"
	import KeyboardShortcuts from "./sections/KeyboardShortcuts.svelte"
	import UserInterface from "./sections/UserInterface.svelte"
	import FileSynthax from "./sections/FileSynthax.svelte"
</script>

<TabGroup class="p-5">
	<TabList class="mt-4">
		<Tab class="border-t border-t-gray-500">{$text.sections.introduction.title}</Tab>
		<Tab>{$text.sections.instruction_set.title}</Tab>
		<!-- <Tab>{$text.sections.ui.title}</Tab> -->
		<Tab>{$text.sections.keyboard_shortcuts.title}</Tab>
		<Tab>{$text.sections.code_files.title}</Tab>
		<Tab>{$text.sections.examples.title}</Tab>
	</TabList>
	<TabPanels class="py-7 px-14">
		<TabPanel>
			<Introduction />
		</TabPanel>
		<TabPanel>
			<InstructionSetSection />
		</TabPanel>
		<!-- <TabPanel>
			<UserInterface />
		</TabPanel> -->
		<TabPanel>
			<KeyboardShortcuts />
		</TabPanel>
		<TabPanel>
			<FileSynthax />
		</TabPanel>
		<TabPanel>
			<Examples />
		</TabPanel>
	</TabPanels>
</TabGroup>
