export function interpolate(base: string, ...values: any[]): string {
	let result = base
	values.forEach((value: string, index: number) => {
		result = result.replace(`{${index}}`, value.toString())
	})
	return result
}
