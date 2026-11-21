import { describe, expect, it } from 'vitest'
import { summarize } from '~/data/specs'
import { formatDate, formatPeso, localDateFromToday, makeReference } from '~/utils/format'

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

describe('formatPeso', () => {
  it('formats pesos with grouping and no decimals', () => {
    expect(formatPeso(1398000)).toBe('₱1,398,000')
    expect(formatPeso(22677.4)).toBe('₱22,677')
  })
})

describe('summarize', () => {
  it('turns numeric variant values into a range with a unit', () => {
    expect(summarize(['445', '445', '565'], 'km')).toBe('445–565 km')
    expect(summarize(['1400', '1400'], 'km')).toBe('1,400 km')
  })

  it('joins text values and skips "not available"', () => {
    expect(summarize(['1.5T', '2.0T', '1.5T'])).toBe('1.5T / 2.0T')
    expect(summarize(['-', '40'], 'km')).toBe('40 km')
    expect(summarize(['Remote key\nBluetooth key'])).toBe('Remote key, Bluetooth key')
  })

  it('returns undefined when there is nothing to show', () => {
    expect(summarize(undefined)).toBeUndefined()
    expect(summarize(['-', '-'])).toBeUndefined()
  })
})
