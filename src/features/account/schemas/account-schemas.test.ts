import { describe, expect, it } from 'vitest'

import { changePasswordSchema } from '@/features/account/schemas/change-password-schema'
import { editProfileSchema } from '@/features/account/schemas/edit-profile-schema'
import { createUpgradeSellerSchema } from '@/features/account/schemas/upgrade-seller-schema'
import { createUpgradeServiceProviderSchema } from '@/features/account/schemas/upgrade-service-provider-schema'

describe('account schemas', () => {
  it('validates edit profile form', () => {
    expect(
      editProfileSchema.safeParse({
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
        age: '24',
      }).success,
    ).toBe(true)
  })

  it('rejects mismatched change-password confirmation', () => {
    expect(
      changePasswordSchema.safeParse({
        old_password: 'oldsecret',
        password: 'newsecret',
        password_confirmation: 'othersecret',
      }).success,
    ).toBe(false)
  })

  it('requires seller email and phone when configured', () => {
    const schema = createUpgradeSellerSchema(true, true)
    expect(
      schema.safeParse({
        store_owner_name: 'Ali',
        store_name: 'Bazario',
        address: 'Berlin',
        email: '',
        phone: '',
      }).success,
    ).toBe(false)
  })

  it('requires provider email and phone when configured', () => {
    const schema = createUpgradeServiceProviderSchema(true, true)
    expect(
      schema.safeParse({
        name: 'Provider One',
        address: 'Berlin',
        email: '',
        phone: '',
      }).success,
    ).toBe(false)
  })
})
