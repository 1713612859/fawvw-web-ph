import { describe, expect, it } from 'vitest'
import { financeDefaults, monthlyPayment, teaserMonthly } from '~/utils/finance'

describe('monthlyPayment', () => {
  it('matches the standard amortization formula (₱1,118,400 at 8% for 60 months)', () => {
    expect(Math.round(monthlyPayment(1118400, 8, 60))).toBe(22677)
  })

  it('splits the principal evenly when the rate is 0%', () => {
    expect(monthlyPayment(120000, 0, 12)).toBe(10000)
  })

  it('returns 0 for an empty loan or zero term', () => {
    expect(monthlyPayment(0, 8, 60)).toBe(0)
    expect(monthlyPayment(100000, 8, 0)).toBe(0)
  })

  it('costs more in total than the principal when interest applies', () => {
    const p = 1_000_000
    expect(monthlyPayment(p, 8, 36) * 36).toBeGreaterThan(p)
  })

  it('pays less per month on a longer term', () => {
    expect(monthlyPayment(1_000_000, 8, 60)).toBeLessThan(monthlyPayment(1_000_000, 8, 36))
  })
})

describe('teaserMonthly', () => {
  it('uses the site defaults (20% down, 60 months, 8%)', () => {
    const { downPct, months, rate } = financeDefaults
    expect(financeDefaults).toEqual({ downPct: 20, months: 60, rate: 8 })
    expect(teaserMonthly(1398000)).toBeCloseTo(monthlyPayment(1398000 * (1 - downPct / 100), rate, months), 6)
  })
})
