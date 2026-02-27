<script lang="ts">
	import type { ByteRegister } from "$lib/register/register.svelte"
	import { Base, u8ToPaddedString } from "$lib/types/integer"
	import { unreachable } from "$lib/util/development"

	export interface ByteRegisterProps {
		/** The register attached to this component */
		register: ByteRegister
		/** Base in which to display the value of the register */
		base?: Base
		/** Wether the decimal value should be signed or unsigned */
		signed?: boolean
		/** ID of this element */
		id?: string
		disabled?: boolean
		readonly?: boolean
		tabindex?: number
		/** Callback for when editing the value of the register fails */
		oneditfail?: (error: Error) => void
	}

	let {
		register,
		base = Base.DECIMAL,
		signed = true,
		id,
		disabled,
		readonly,
		tabindex,
		oneditfail: onerror,
	}: ByteRegisterProps = $props()

	/** Wether the input is currently focused and editing its value or not */
	let isEditing = $state(false)

	/** Value of the register formatted appropriately in regards of signedness and base */
	let displayValue = $derived.by(() => {
		if (base === Base.DECIMAL) {
			return signed ? register.signed.toString(10) : register.unsigned.toString(10)
		}
		return u8ToPaddedString(register.unsigned, base)
	})

	/** Value edited by the input */
	let editValue = $state("")

	/** Returns the value that should be displayed by the input. Passed as getter to value:bind of the input element. */
	function get(): string {
		return isEditing ? editValue : displayValue
	}

	/** Format and set {@link editValue}. Passed as setter to value:bind of the input element. */
	function set(value: string): void {
		switch (base) {
			case Base.BINARY:
				editValue = value.replaceAll(/[^01]/g, "")
				break

			case Base.DECIMAL:
				editValue = value.replaceAll(/[^\d-]/g, "").replaceAll(/(?<!^)-/g, "")
				break

			case Base.HEX:
				editValue = value.toUpperCase().replaceAll(/[^0-9ABCDEF]/g, "")
				break

			default:
				unreachable()
		}
	}

	/** Callback for when the input element acquires focus */
	function onfocus(): void {
		let newEditValue: string
		switch (base) {
			case Base.DECIMAL:
				newEditValue =
					signed ? register.signed.toString(10) : register.unsigned.toString(10)
				break

			case Base.BINARY:
				newEditValue = register.unsigned.toString(2)
				break

			case Base.HEX:
				newEditValue = register.unsigned.toString(16).toUpperCase()
				break

			default:
				unreachable()
		}
		editValue = newEditValue !== "0" ? newEditValue : ""
		isEditing = true
	}

	/** Callback for when the input element looses focus */
	function onblur(): void {
		isEditing = false
	}

	/** Callaback for the input element "change" event. Parse user input and update register value */
	function onchange(): void {
		try {
			const value = editValue !== "" ? parseInt(editValue, base) : 0
			if (base === Base.DECIMAL && signed) {
				register.signed = value
			} else {
				register.unsigned = value
			}
		} catch (err: unknown) {
			onerror?.(err as Error)
		}
	}
</script>

<input
	type="text"
	{id}
	{tabindex}
	{disabled}
	{readonly}
	autocapitalize="characters"
	autocorrect="off"
	enterkeyhint="done"
	spellcheck="false"
	class="
		relative
		h-7.5
		w-25
		rounded-md
		border
		border-black
		bg-gray-100
		text-center
		font-mono
		text-base
		leading-7.5
		focus:bg-black
		focus:text-gray-100
	"
	{onfocus}
	{onblur}
	{onchange}
	bind:value={get, set}
/>
