<script lang="ts" module>
	/**
	 * Function that validates the parsed Integer.
	 * Should throw an error if the value is not considered valid. */
	export type InputValidator = (value: Integer, base: Base, signed: boolean) => void

	/** Basa in which an integer can be displayed in */
	export type Base = 2 | 10 | 16

	/** Function that parses the input into an Integer */
	type InputParser = (size: Size, str: string) => Integer

	interface Props {
		/** Integer that should be edited/displayed */
		value: Integer
		/** Wether editing is enabled or not */
		editable?: boolean
		/** Wether the integer should be displayed as signed or not */
		signed?: boolean
		/** Base in which the integer will be represented */
		base?: Base
		/** Function for validating new values before being committed */
		validator?: InputValidator
		oninvalidinput?: (input: string) => void
		onvalidationerror?: (input: string, error: Error) => void
		onchange?: (value: Integer) => void
	}

	const forbiddenBinaryCharacters = /[^01]*/g
	const forbiddenHexadecimalCharacters = /[^a-fA-F\d]*/g
	const forbiddenUnsignedDecimalCharacters = /\D*/g
	const forbiddenSignedDecimalCharacters = /[^-\d]*/g
	const binaryInputRegex = /^[01]*$/
	const hexadecimalInputRegex = /^[a-fA-F\d]*$/
	const signedDecimalInputRegex = /^-?\d*$/
	const unsignedDecimalInputRegex = /^\d*$/
</script>

<script lang="ts">
	import Integer, { type Size } from "$lib/model/integer"
	import { onMount } from "svelte"

	let {
		value = $bindable(),
		editable = $bindable(true),
		signed = $bindable(true),
		base = $bindable(10),
		validator = $bindable(() => {}),
		oninvalidinput = undefined,
		onvalidationerror = undefined,
		onchange = undefined,
	}: Props = $props()

	/** The variable the html input element is bounded to */
	let inputEl: HTMLInputElement | undefined = $state()
	/** The variable to which the "value" property of the input element is bound to */
	let inputValue: string = $state("")
	/** Wether or not the input is being edited */
	let editing: boolean = $state(false)
	/** Size in bits of the value */
	let sizeBits: Size = $derived(value.sizeBits())

	let {
		/**
		 * Regexp representing the characters that the user won't be allowed to input
		 * given the current base and signedness */
		forbiddenCharacters,
		/** Regexp representing a valid input string given the current base and signedness */
		validInputRegexp,
		/** Function that will be used to parse user input at the end of an edit */
		inputParser,
	} = $derived.by(() => {
		let forbiddenCharacters: RegExp
		let validInputRegexp: RegExp
		let inputParser: InputParser
		switch (base) {
			case 10:
				if (signed) {
					forbiddenCharacters = forbiddenSignedDecimalCharacters
					validInputRegexp = signedDecimalInputRegex
					inputParser = Integer.fromSignedString
				} else {
					forbiddenCharacters = forbiddenUnsignedDecimalCharacters
					validInputRegexp = unsignedDecimalInputRegex
					inputParser = Integer.fromUnsignedString
				}
				break
			case 2:
				forbiddenCharacters = forbiddenBinaryCharacters
				validInputRegexp = binaryInputRegex
				inputParser = Integer.fromBinaryString
				break
			case 16:
				forbiddenCharacters = forbiddenHexadecimalCharacters
				validInputRegexp = hexadecimalInputRegex
				inputParser = Integer.fromHexadecimalString
				break
			default:
				throw new Error("Unsupported base")
		}
		return { forbiddenCharacters, validInputRegexp, inputParser }
	})

	/** String containing the representation of the value given the current base and signedness */
	let valueToString = $derived.by(() => {
		switch (base) {
			case 10:
				return signed ? value.toSignedDecimalString() : value.toUnsignedDecimalString()
			case 2:
				return value.toBinaryString()
			case 16:
				return value.toHexadecimalString()
			default:
				throw new Error("Unsupported base")
		}
	})

	onMount(() => (inputValue = valueToString))
	$effect(() => {
		inputValue = valueToString
	})

	/** Focus the component */
	export function startEdit() {
		if (editing || !editable) {
			return
		}
		editing = true
		inputEl?.focus()
		inputEl?.select()
	}

	/** Unfocus the component and commits any changes made */
	export function endEdit() {
		if (!editing || !editable) {
			return
		}

		editing = false
		inputEl?.blur()
		const inputString = inputValue

		if (!validInputRegexp.test(inputString.trim())) {
			inputValue = valueToString
			oninvalidinput?.(inputString)
			return
		}

		try {
			const parsedValue = inputParser(value.sizeBits(), inputString)
			validator?.(parsedValue, base, signed)

			if (parsedValue.unsigned() === value.unsigned()) {
				return
			}

			value = parsedValue
			onchange?.(value)
		} catch (error) {
			inputValue = valueToString
			onvalidationerror?.(inputValue, error as Error)
			return
		}
	}

	/**
	 * Runs on the "input" events fired by the input element.
	 * Filters unwanted characters and keeps the text's length so that every character is visible */
	function formatText() {
		let formattedInput = inputValue
		formattedInput = formattedInput.replaceAll(forbiddenCharacters, "")
		if (formattedInput.length > value.sizeBits()) {
			formattedInput = formattedInput.substring(0, value.sizeBits())
		}
		inputValue = formattedInput
	}
</script>

<div class="relative flex h-fit w-fit items-center justify-center p-2 text-lg">
	<input
		type="text"
		bind:this={inputEl}
		bind:value={inputValue}
		disabled={!editable}
		onfocusin={startEdit}
		onchange={endEdit}
		onblur={endEdit}
		oninput={formatText}
		style:width={`${sizeBits}ch`}
		class="box-content bg-transparent text-center selection:bg-transparent focus:outline-none"
	/>
</div>
