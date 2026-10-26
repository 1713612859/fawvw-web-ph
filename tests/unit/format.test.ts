import { describe, expect, it } from 'vitest'
import { formatSpec, modelDetails } from '~/data/modelDetails'
import { formatPrice } from '~/data/models'
import { formatDate, localDateFromToday, makeReference } from '~/utils/format'

describe('formatDate', () => {
  it('formats ISO dates in Philippine English without time-zone drift', () => {
    expect(formatDate('2026-10-20')).toBe('October 20, 2026')
    expect(formatDate('2026-01-01')).toBe('January 1, 2026')
  })
})

describe('localDateFromToday', () => {
  it('returns tomorrow as yyyy-mm-dd in local time', () => {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    const expected = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
    expect(localDateFromToday(1)).toBe(expected)
    expect(localDateFromToday(0)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('makeReference', () => {
  it('always produces PREFIX- plus 6 unambiguous characters', () => {
    for (let i = 0; i < 5000; i++) expect(makeReference('QT')).toMatch(/^QT-[A-HJ-NP-Z2-9]{6}$/)
  })
})

describe('formatPrice', () => {
  it('formats pesos with grouping and no decimals', () => {
    expect(formatPrice(1398000)).toBe('₱1,398,000')
    expect(formatPrice(22677)).toBe('₱22,677')
  })
})

describe('formatSpec', () => {
  it('adds grouping and units to numbers, passes text through', () => {
    const spec = modelDetails.magotan!.spec
    expect(formatSpec(spec, 'length', 'mm')).toBe('4,917 mm')
    expect(formatSpec(spec, 'seats')).toBe('5')
    expect(formatSpec(spec, 'transmission')).toBe('7-speed DSG')
  })
})
