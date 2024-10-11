import { describe, expect, test } from "vitest"
import Integer, {
	isInRangeSigned,
	isInRangeUnsigned,
	RANGES,
	signedToUnsigned,
	unsignedToSigned,
} from "./integer"

const SIZES = [8, 16, 32] as const

describe("isInRangeSigned", () => {
	for (const size of SIZES) {
		const RANGE = RANGES.signed[size]
		describe(`${size} bit`, () => {
			describe("Given a value out of the signed range", () => {
				test("Too low", () => {
					const lowValue = RANGE.lower - 1
					expect(isInRangeSigned(lowValue, size)).toBe(false)
				})
				test("Too high", () => {
					const highValue = RANGE.upper + 1
					expect(isInRangeSigned(highValue, size)).toBe(false)
				})
			})
			describe("Given a value inside of the signed range", () => {
				test("Lowest", () => {
					const lowest = RANGE.lower
					expect(isInRangeSigned(lowest, size)).toBe(true)
				})
				test("Highest", () => {
					const highest = RANGE.upper
					expect(isInRangeSigned(highest, size)).toBe(true)
				})
				test("In the middle", () => {
					const n = RANGE.upper - Math.floor(RANGE.upper / 2)
					expect(isInRangeSigned(n, size)).toBe(true)
				})
			})
		})
	}
})

describe("isInRangeUnigned", () => {
	for (const size of SIZES) {
		const RANGE = RANGES.unsigned[size]
		describe(`${size} bit`, () => {
			describe("Given a value out of the unsigned range", () => {
				test("Too low", () => {
					const lowValue = RANGE.lower - 1
					expect(isInRangeUnsigned(lowValue, size)).toBe(false)
				})
				test("Too high", () => {
					const highValue = RANGE.upper + 1
					expect(isInRangeUnsigned(highValue, size)).toBe(false)
				})
			})
			describe("Given a value inside of the unsigned range", () => {
				test("Lowest", () => {
					const lowest = RANGE.lower
					expect(isInRangeUnsigned(lowest, size)).toBe(true)
				})
				test("Highest", () => {
					const highest = RANGE.upper
					expect(isInRangeUnsigned(highest, size)).toBe(true)
				})
				test("In the middle", () => {
					const n = RANGE.upper - Math.floor(RANGE.upper / 2)
					expect(isInRangeUnsigned(n, size)).toBe(true)
				})
			})
		})
	}
})

describe("signedToUnsigned", () => {
	for (const size of SIZES) {
		const RANGE = RANGES.signed[size]
		describe(`${size} bit`, () => {
			describe("Given a value out of the signed range throws error", () => {
				test("Too low", () => {
					const lowValue = RANGE.lower - 1
					expect(() => signedToUnsigned(lowValue, size)).toThrowError()
				})
				test("Too high", () => {
					const highValue = RANGE.upper + 1
					expect(() => signedToUnsigned(highValue, size)).toThrowError()
				})
			})
			describe("Given a value inside of the signed range", () => {
				test("Lowest signed should become highest signed + 1", () => {
					const lowest = RANGE.lower
					expect(signedToUnsigned(lowest, size)).toBe(RANGE.upper + 1)
				})
				test("Highest signed should remain the same", () => {
					const highest = RANGE.upper
					expect(signedToUnsigned(highest, size)).toBe(RANGE.upper)
				})
				test("-1 should become max unsigned", () => {
					expect(signedToUnsigned(-1, size)).toBe(RANGES.unsigned[size].upper)
				})
				test("0 should stay 0", () => {
					expect(signedToUnsigned(0, size)).toBe(0)
				})
			})
			test("Given a value which isn't an integer throws error", () => {
				expect(() => signedToUnsigned(RANGE.upper - 0.2, size)).toThrowError()
			})
		})
	}
})

describe("unsignedToSigned", () => {
	for (const size of SIZES) {
		const RANGE = RANGES.unsigned[size]
		describe(`${size} bit`, () => {
			describe("Given a value out of the unsigned range throws error", () => {
				test("Too low", () => {
					const lowValue = RANGE.lower - 1
					expect(() => unsignedToSigned(lowValue, size)).toThrowError()
				})
				test("Too high", () => {
					const highValue = RANGE.upper + 1
					expect(() => unsignedToSigned(highValue, size)).toThrowError()
				})
			})
			describe("Given a value inside of the unsigned range", () => {
				test("Lowest unsigned should stay 0", () => {
					expect(unsignedToSigned(RANGE.lower, size)).toBe(0)
				})
				test("Highest signed should stay the same", () => {
					const maxSigned = RANGES.signed[size].upper
					expect(unsignedToSigned(maxSigned, size)).toBe(maxSigned)
				})
				test("Highest signed + 1 should become lowest signed", () => {
					const maxSigned = RANGES.signed[size].upper
					const minSigned = RANGES.signed[size].lower
					expect(unsignedToSigned(maxSigned + 1, size)).toBe(minSigned)
				})
				test("Max unsigned should become -1", () => {
					expect(unsignedToSigned(RANGE.upper, size)).toBe(-1)
				})
			})
			test("Given a value which isn't an integer throws error", () => {
				expect(() => unsignedToSigned(RANGE.upper - 0.2, size)).toThrowError()
			})
		})
	}
})

describe("Integer", () => {
	for (const size of SIZES) {
		const unsigned = RANGES.unsigned[size]
		const signed = RANGES.signed[size]

		describe(`${size} bit`, () => {
			describe("constructor", () => {
				describe("Value out of unsigned range throws error", () => {
					test("Too low", () => {
						expect(() => new Integer(size, unsigned.lower - 1)).toThrowError()
					})
					test("Too high", () => {
						expect(() => new Integer(size, unsigned.upper + 1)).toThrowError()
					})
				})
				test("Value is not an integer throws", () => {
					expect(() => new Integer(size, unsigned.upper - 0.2)).toThrowError()
				})
				describe("Value in range", () => {
					test("Min unsigned", () => {
						expect(new Integer(size, unsigned.lower))
					})
					test("Max unsigned", () => {
						expect(new Integer(size, unsigned.upper))
					})
				})
			})

			describe("signed", () => {
				test("Min unsigned should stay 0", () => {
					expect(new Integer(size, unsigned.lower).signed()).toBe(0)
				})
				test("Max unsigned should become -1", () => {
					expect(new Integer(size, unsigned.upper).signed()).toBe(-1)
				})
				test("Max signed + 1 should become min signed", () => {
					expect(new Integer(size, signed.upper + 1).signed()).toBe(signed.lower)
				})
				test("Max signed should stay max signed", () => {
					expect(new Integer(size, signed.upper).signed()).toBe(signed.upper)
				})
			})

			describe("unsigned", () => {
				test("Min unsigned should stay min unsigned", () => {
					expect(new Integer(size, unsigned.lower).unsigned()).toBe(unsigned.lower)
				})
				test("Max unsigned should stay max unsigned", () => {
					expect(new Integer(size, unsigned.upper).unsigned()).toBe(unsigned.upper)
				})
			})

			describe("toBinaryString", () => {
				const allZeroes = new Integer(size, unsigned.lower).toBinaryString()
				const allOnes = new Integer(size, unsigned.upper).toBinaryString()

				test("String is 'size' long", () => {
					expect(allZeroes.length).toBe(size)
					expect(allOnes.length).toBe(size)
				})

				test("String is correct", () => {
					expect(allZeroes).toBe("0".repeat(size))
					expect(allOnes).toBe("1".repeat(size))
				})
			})
		})
	}
})
