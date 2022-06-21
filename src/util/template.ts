export function interpolate(base: string, ...values: string[]): string {
	let result = base
	values.forEach((value: string, index: number) => {
		result = result.replace(`{${index}}`, value)
	})
	return result
}
