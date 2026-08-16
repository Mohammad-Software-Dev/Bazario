import { describe, expect, it } from 'vitest'

import { getLocationTypeLabel, locationTypeOptions } from '@/features/services/lib/location-type'

describe('location type helpers', () => {
  it('exposes the known location type options', () => {
    expect(locationTypeOptions.map((option) => option.value)).toEqual([
      '',
      'remote',
      'on_site',
      'at_customer',
    ])
  })

  it('returns translated label for known values', () => {
    expect(getLocationTypeLabel('remote', (key) => key)).toBe('locationTypes.remote')
  })

  it('returns raw value for unknown types', () => {
    expect(getLocationTypeLabel('hybrid', (key) => key)).toBe('hybrid')
  })

  it('returns null for empty values', () => {
    expect(getLocationTypeLabel('', (key) => key)).toBeNull()
  })
})
