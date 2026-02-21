/** An N-dimensions array where the first index type has the same type of the first element of the provided tuple, the second index of the second element and so on until a value of type V (or undefined) is found.
 * @example
 * enum Enum1 { a, b, c }
 * enum Enum2 { d, e, f }
 * enum Enum3 { g, h, i }
 *
 * const map: EnumCombinationMap<() => void, [Enum1, Enum2, Enum3]> = {
 *	[Enum1.b]: {
 *		[Enum2.d]: {
 *			[Enum3.i]: () => {
 *				console.log("Hi!")
 *			}
 *		}
 *	}
 * }
 *
 * map[Enum1.b][Enum2.d][Enum3.i]() // "Hi!"
 * map[Enum1.a]?.[Enum2.e]?.[Enum3.i]?.() === undefined // true
 * */
export type EnumCombinationMap<V, K extends number[]> =
	K extends [infer U extends number, ...infer Rest extends number[]] ?
		{
			[B in U]?: EnumCombinationMap<V, Rest>
		}
	:	V
