/** Clamp a number between a maximum value and a minimum value */
export function clamp<TValue extends number, TMin extends number, TMax extends number>(
	value: TValue,
	min: TMin = 0 as TMin,
	max: TMax = 1 as TMax,
): number {
	return Math.min(Math.max(value, min), max)
}
