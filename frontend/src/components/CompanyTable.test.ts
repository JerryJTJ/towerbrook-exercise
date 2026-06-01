import { describe, it, expect } from 'vitest'
import { toCompanyRows } from './CompanyTable'

describe('toCompanyRows', () => {
  it('maps API payload to table rows with fallback theme and finance values', () => {
    const data = [
      {
        id: 1,
        name: 'Example Co',
        category: 'Technology',
        score: 88,
        theme: null,
        finances: [
          { id: 10, metric: 'revenue', value: 420, source: 'Q1' },
          { id: 11, metric: 'EBITDA', value: 25, source: 'Q1' },
        ],
        saved: true,
      },
    ]

    const rows = toCompanyRows(data)

    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual({
      id: 1,
      name: 'Example Co',
      category: 'Technology',
      score: 88,
      theme: '—',
      saved: true,
      revenue: 420,
      EBITDA: 25,
      equity: null,
    })
  })
})
