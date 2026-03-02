<script lang="ts">
	import type { InvalidI8Error, InvalidU8Error } from "$lib/errors/integer"
	import type { ByteRegister } from "$lib/register/register.svelte"
	import type { FlashableElement, FlashableID } from "$lib/state/flash_animations_playback.svelte"
	import { Base, u8ToPaddedString } from "$lib/types/integer"
	import { makeFlashAnimation } from "$lib/util/animation"
	import { unreachable } from "$lib/util/development"

	/** Error that could be thrown when editing a word register */
	export type ByteRegisterEditError = InvalidI8Error | InvalidU8Error

	export interface ByteRegisterProps {
		/** The register attached to this component */
		register: ByteRegister
		/** Base in which to display the value of the register */
		base?: Base
		/** Wether the decimal value should be signed or unsigned */
		signed?: boolean
		id?: string
		flashableId?: FlashableID
		class?: string
		disabled?: boolean
		readonly?: boolean
		tabindex?: number
		/** Callback for when editing the value of the register fails */
		oneditfail?: (error: ByteRegisterEditError) => void
	}

	let {
		register,
		base = Base.DECIMAL,
		signed = true,
		id,
		flashableId,
		disabled,
		readonly,
		tabindex,
		...props
	}: ByteRegisterProps = $props()

	/** Handle to the input element */
	let inputElement: HTMLInputElement

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
		} catch (error: unknown) {
			props.oneditfail?.(error as ByteRegisterEditError)
		}
	}

	/** Commit edit on enter, cancel edit on escape */
	function onkeydown(event: KeyboardEvent): void {
		if (event.key === "Enter") {
			inputElement.blur()
			return
		}
		if (event.key === "Escape") {
			editValue = makeEditValue()
			inputElement.blur()
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

	// Implements FlashableElement
	export function getFlashableID(): FlashableID {
		if (flashableId !== undefined) {
			return flashableId
		}
		unreachable("Flashable ID not defined on ByteRegister")
	}

	// Implements FlashableElement
	export function createFlashAnimation(): Animation {
		return makeFlashAnimation(inputElement, {
			background: true,
			text: true,
			border: true,
		})
	}

	// Implements FlashableElement
	export function getFlashableSubelements(): FlashableElement[] {
		return []
	}
</script>

<input
	bind:this={inputElement}
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
		shadow-register
		{props.class ?? ''}
	"
	{onfocus}
	{onblur}
	{onchange}
	{onkeydown}
	bind:value={get, set}
/>
