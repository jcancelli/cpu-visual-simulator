<script lang="ts">
	import type {
		AddressOutOfRangeError,
		InvalidWordAlignedAddressError,
	} from "$lib/errors/address"
	import type { DuplicateLabelError, InvalidLabelError } from "$lib/errors/label"
	import type Labels from "$lib/state/labels.svelte"
	import type { WordAlignedAddress } from "$lib/types/address"
	import { fade, slide } from "svelte/transition"

	/** Error that could be thrown when editing a label */
	export type LabelEditError =
		| InvalidLabelError
		| AddressOutOfRangeError
		| InvalidWordAlignedAddressError
		| DuplicateLabelError

	export interface LabelProps {
		labels: Labels
		address: WordAlignedAddress
		id?: string
		class?: string
		readonly?: boolean
		disabled?: boolean
		tabindex?: number
		oneditfail?: (error: LabelEditError) => void
	}

	let {
		labels,
		address,
		id,
		readonly,
		disabled,
		tabindex,
		oneditfail,
		...props //
	}: LabelProps = $props()

	/** Either the value of the label or null */
	const label = $derived(labels.addressToLabel[address])

	/** Wether the user is editing the label or not */
	let isEditing = $state(false)

	/** Wether the input element is mounted on the DOM */
	let inputIsMounted = $state(false)

	/** If true display the input if false display the button */
	let isExpanded = $derived(isEditing || label !== null)

	/** The formatted value of the label that is displayed when not editing */
	const displayValue = $derived(label !== null ? `${label} :` : "")

	/** The string that is being edited by the input */
	let editValue = $state("")

	/** Return the value that should be displayed by the input. Passed as getter to bind:value */
	function get(): string {
		return isEditing ? editValue : displayValue
	}

	/** Format editValue while it is being edited by the user. Passed as setter to bind:value */
	function set(value: string): void {
		editValue = value.replaceAll(/[^A-Za-z_]/g, "").toUpperCase()
	}

	/** Finish editing and map/edit/unmap label */
	function onblur(): void {
		try {
			if (editValue !== "") {
				labels.mapLabel(editValue, address)
			} else {
				labels.unmapAddress(address)
			}
		} catch (error: unknown) {
			oneditfail?.(error as LabelEditError)
		} finally {
			isEditing = false
		}
	}

	/** Start editing the label */
	function startEdit(): void {
		editValue = label ?? ""
		isEditing = true
	}

	/** Track when input is mounted and focus it on mount*/
	function inputAttach(input: HTMLInputElement): () => void {
		inputIsMounted = true
		input.focus()
		return () => {
			inputIsMounted = false
		}
	}
</script>

<div {id} class="memory-label h-(--register-height) w-fit {props.class ?? ''}">
	{#if isExpanded}
		<input
			type="text"
			class="
				memory-label-input
				h-(--label-height)
				w-(--label-width)
				origin-right
				rounded-l-md
				border
				border-r-0
				border-label-border-light
				bg-label-background-light
				pl-2.5
				font-mono
				shadow-label
				text-shadow-label-text-light
				dark:border-label-border-dark
				dark:bg-label-background-dark
				dark:text-shadow-label-text-dark
			"
			bind:value={get, set}
			{readonly}
			{disabled}
			{tabindex}
			onfocus={startEdit}
			{onblur}
			transition:slide={{ axis: "x" }}
			{@attach inputAttach}
		/>
	{:else if !inputIsMounted}
		<!-- TODO: translate aria-label -->
		<button
			onclick={startEdit}
			{disabled}
			{tabindex}
			in:fade={{ duration: 50 }}
			aria-label="Create label"
		>
			<!-- TODO: replace with a flowbite icon -->
			<svg class="w-6 fill-label-button-light dark:fill-label-button-dark">
				<path
					d="M21,12l-4.37,6.16C16.26,18.68,15.65,19,15,19h-3l0-2h3l3.55-5L15,7H5v3H3V7c0-1.1,0.9-2,2-2h10c0.65,0,1.26,0.31,1.63,0.84 L21,12z M10,15H7v-3H5v3H2v2h3v3h2v-3h3V15z"
				/>
			</svg>
		</button>
	{/if}
</div>
