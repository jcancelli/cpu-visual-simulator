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
		id?: string
		class?: string
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
		...props
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

	/** Init editValue and enable editing */
	function onfocus(): void {
		editValue = makeEditValue()
		isEditing = true
	}

	/** Disable editing */
	function onblur(): void {
		isEditing = false
	}

	/** Parse user input and update register value */
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

	/** Commit edit on enter, cancel edit on escape */
	function onkeydown(event: KeyboardEvent): void {
		if (event.key === "Enter") {
			;(event.target as HTMLInputElement).blur()
			return
		}
		if (event.key === "Escape") {
			editValue = makeEditValue()
			;(event.target as HTMLInputElement).blur()
			return
		}
	}

	/** @returns A string that represents the content of the register */
	function makeEditValue(): string {
		let newEditValue: string
		switch (base) {
			case Base.DECIMAL:
				if (signed) {
					newEditValue = register.signed.toString(10)
				} else {
					newEditValue = register.unsigned.toString(10)
				}
				if (newEditValue === "0") {
					newEditValue = ""
				}
				break

			case Base.BINARY:
			// Fallthrough
			case Base.HEX:
				newEditValue = u8ToPaddedString(register.unsigned, base)
				break

			default:
				unreachable()
		}
		return newEditValue
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
		register
		register-foreground
		register-background
		register-border
		register-focusable
		w-(--byte-register-width)
		rounded-md
		text-center
		{props.class ?? ''}
	"
	{onfocus}
	{onblur}
	{onchange}
	{onkeydown}
	bind:value={get, set}
/>
