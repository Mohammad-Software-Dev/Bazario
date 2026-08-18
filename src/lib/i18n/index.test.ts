import { describe, expect, it, vi } from 'vitest'

import { queryClient } from '@/app/providers/query-client'
import i18n from '@/lib/i18n'

describe('i18n document sync', () => {
  it('sets document lang and dir when arabic is active', async () => {
    await i18n.changeLanguage('ar')

    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('invalidates react-query cache when the language changes', async () => {
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')

    await i18n.changeLanguage('de')

    expect(invalidateQueriesSpy).toHaveBeenCalled()
  })
})
