<script lang="ts" context="module">
	/**
	 * Function that validates the parsed Integer.
	 * Should throw an error if the value is not considered valid.
	 * */
	export type InputValidator = (value: Integer, base: Base, signed: boolean) => void

	/** Base in which the integer should be represented in */
	export enum Base {
		Decimal,
		Binary,
	}

	/** Function that parses the input into an Integer */
	type InputParser = (size: Size, str: string) => Integer

	const forbiddenBinaryCharacters = /[^01]*/g
	const forbiddenUnsignedDecimalCharacters = /\D*/g
	const forbiddenSignedDecimalCharacters = /[^-\d]*/g
	const binaryInputRegex = /^[01]*$/
	const signedDecimalInputRegex = /^-?\d*$/
	const unsignedDecimalInputRegex = /^\d*$/
</script>

<script lang="ts">
	import Integer, { type Size } from "$lib/model/integer"
	import { createEventDispatcher, onMount } from "svelte"

	/** Integer that should be edited/displayed */
	export let value: Integer
	/** Wether editing is enabled or not */
	export let editable: boolean = true
	/** Wether the integer should be displayed as signed or not */
	export let signed: boolean = true
	/** Base in which the integer will be represented */
	export let base: Base = Base.Decimal
	/** Function for validating new values before being committed */
	export let validator: InputValidator = () => {}

	const dispatch = createEventDispatcher()

	let inputElement: HTMLInputElement
	let editing: boolean = false
	let forbiddenCharacters: RegExp
	let validInputRegexp: RegExp
	let inputParser: InputParser

	onMount(() => setTextToCurrentValue())

	$: {
		// here so the block is re-run when they change
		value
		base
		signed

		setTextToCurrentValue()
	}
	$: {
		// here so the block is re-run when they change
		base
		signed

		updateForbiddenCharacters()
		updateValidInputRegexp()
		updateInputParser()
	}

	/** Focus the component */
	export function startEdit() {
		if (editing || !editable) {
			return
		}
		editing = true
		inputElement.focus()
		inputElement.select()
	}

	/** Unfocus the component and commits any changes made */
	export function endEdit() {
		if (!editing || !editable) {
			return
		}

		editing = false
		inputElement.blur()
		const inputText = inputElement.value

		if (!validInputRegexp.test(inputText.trim())) {
			setTextToCurrentValue()
			dispatch("invalid-input", { input: inputText })
			return
		}

		try {
			const parsedValue = inputParser(value.sizeBits(), inputText)
			validator?.(parsedValue, base, signed)

			if (parsedValue.unsigned() === value.unsigned()) {
				return
			}

			value = parsedValue
			dispatch("changed", { value })
		} catch (error) {
			setTextToCurrentValue()
			dispatch("validation-error", { input: inputText, error })
			return
		}
	}

	/**
	 * Runs on the "input" events fired by the input element.
	 * Filters unwanted characters and keeps the text's length so that every character is visible
	 * */
	function formatText() {
		let formattedInput = inputElement.value
		formattedInput = formattedInput.replaceAll(forbiddenCharacters, "")
		if (formattedInput.length > value.sizeBits()) {
			formattedInput = formattedInput.substring(0, value.sizeBits())
		}
		inputElement.value = formattedInput
	}

	/** Returns a string representing the value in the appropriate notation */
	function valueToString(): string {
		switch (base) {
			case Base.Decimal:
				return signed ? value.toSignedDecimalString() : value.toUnsignedDecimalString()
			case Base.Binary:
				return value.toBinaryString()
			default:
				throw new Error("Unsupported base")
		}
	}

	/** Sets the text to be in sync with the current value of the integer */
	function setTextToCurrentValue() {
		if (!inputElement) {
			return
		}
		inputElement.value = valueToString()
	}

	/**
	 * Update the forbiddenCharacters regexp to the most appropriate one for the current
	 * base and signed values
	 * */
	function updateForbiddenCharacters() {
		switch (base) {
			case Base.Decimal:
				forbiddenCharacters = signed
					? forbiddenSignedDecimalCharacters
					: forbiddenUnsignedDecimalCharacters
				break
			case Base.Binary:
				forbiddenCharacters = forbiddenBinaryCharacters
				break
			default:
				throw new Error("Unsupported base")
		}
	}

	/**
	 * Update the validInput regexp to the most appropriate one for the current
	 * base and signed values
	 * */
	function updateValidInputRegexp() {
		switch (base) {
			case Base.Decimal:
				validInputRegexp = signed ? signedDecimalInputRegex : unsignedDecimalInputRegex
				break
			case Base.Binary:
				validInputRegexp = binaryInputRegex
				break
			default:
				throw new Error("Unsupported base")
		}
	}

	/**
	 * Update the inputParser function to the most appropriate one for the current
	 * base and signed values
	 * */
	function updateInputParser() {
		switch (base) {
			case Base.Decimal:
				inputParser = signed ? Integer.fromSignedString : Integer.fromUnsignedString
				break
			case Base.Binary:
				inputParser = Integer.fromBinaryString
				break
			default:
				throw new Error("Unsupported base")
		}
	}
</script>

<div class="relative flex h-fit w-fit items-center justify-center p-2 text-lg">
	<input
		type="text"
		bind:this={inputElement}
		disabled={!editable}
		on:focusin={startEdit}
		on:change={endEdit}
		on:blur={endEdit}
		on:input={formatText}
		style:width={`${value.sizeBits()}ch`}
		class="bg-transparent text-center selection:bg-transparent focus:outline-none"
	/>
</div>
