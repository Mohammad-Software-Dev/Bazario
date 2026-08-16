import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProductListItem } from '@/features/products/types/product.types'
import type { ServiceListItem } from '@/features/services/types/service.types'
import type { SellerProfile, ServiceProviderProfile } from '@/features/account/types/account.types'
import { adFormSchema, type AdFormValues } from '@/features/ads/schemas/ad-form-schema'
import type { AdPosition, AdTier } from '@/features/ads/types/ad.types'
import { getLocalizedValue } from '@/lib/localized-value'

interface AdFormProps {
  positions: AdPosition[]
  products: ProductListItem[]
  services: ServiceListItem[]
  sellerProfile: SellerProfile | null
  serviceProviderProfile: ServiceProviderProfile | null
  isSubmitting: boolean
  onSubmit: (values: AdFormValues & { ad_position_id: number }) => Promise<void> | void
}

function getPositionIdByTier(positions: AdPosition[], tier: AdTier) {
  const map = {
    gold: 'golden_ad',
    silver: 'silver_ad',
    normal: 'normal_ad',
  } satisfies Record<AdTier, string>

  return positions.find((position) => position.name === map[tier])?.id ?? null
}

function getPositionByTier(positions: AdPosition[], tier: AdTier) {
  const map = {
    gold: 'golden_ad',
    silver: 'silver_ad',
    normal: 'normal_ad',
  } satisfies Record<AdTier, string>

  return positions.find((position) => position.name === map[tier]) ?? null
}

export function AdForm({
  positions,
  products,
  services,
  sellerProfile,
  serviceProviderProfile,
  isSubmitting,
  onSubmit,
}: AdFormProps) {
  const { t, i18n } = useTranslation()
  const {
    register,
    watch,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      tier: 'normal',
      adable_type: sellerProfile ? 'seller' : serviceProviderProfile ? 'service_provider' : 'product',
      adable_id: null,
      duration_days: 1,
    },
  })

  const selectedType = watch('adable_type')
  const selectedTier = watch('tier')
  const selectedDuration = watch('duration_days')
  const selectedPosition = useMemo(
    () => getPositionByTier(positions, selectedTier),
    [positions, selectedTier],
  )
  const allowedDurations = selectedPosition?.allowed_durations?.length
    ? selectedPosition.allowed_durations
    : [1, 2, 3, 4, 5, 6, 7]
  const pricePerDay = selectedPosition?.price_per_day ?? null
  const totalPrice =
    pricePerDay !== null && Number.isFinite(selectedDuration) ? pricePerDay * selectedDuration : null
  const availableTargets = useMemo(() => {
    if (selectedType === 'product') {
      return products.map((product) => ({
        id: product.id,
        label: getLocalizedValue(product.name, i18n.language) || t('common.untitledProduct'),
      }))
    }

    if (selectedType === 'service') {
      return services.map((service) => ({
        id: service.id,
        label: getLocalizedValue(service.title, i18n.language) || t('common.untitledService'),
      }))
    }

    if (selectedType === 'seller' && sellerProfile) {
      return [{ id: sellerProfile.id, label: sellerProfile.store_name }]
    }

    if (selectedType === 'service_provider' && serviceProviderProfile) {
      return [{ id: serviceProviderProfile.id, label: serviceProviderProfile.name }]
    }

    return []
  }, [i18n.language, products, sellerProfile, selectedType, serviceProviderProfile, services, t])

  useEffect(() => {
    if (selectedType === 'seller' || selectedType === 'service_provider') {
      setValue('adable_id', availableTargets[0]?.id ?? null, { shouldValidate: true })
      return
    }

    setValue('adable_id', null, { shouldValidate: false })
  }, [availableTargets, selectedType, setValue])

  const submit = handleSubmit(async (values) => {
    const adPositionId = getPositionIdByTier(positions, values.tier)

    if (!adPositionId) {
      setError('tier', { type: 'manual', message: t('ads.positionUnavailable') })
      return
    }

    const adableId =
      values.adable_type === 'seller' || values.adable_type === 'service_provider'
        ? availableTargets[0]?.id ?? null
        : values.adable_id

    if ((values.adable_type === 'product' || values.adable_type === 'service') && !adableId) {
      setError('adable_id', { type: 'manual', message: t('ads.form.selectTarget') })
      return
    }

    await onSubmit({
      ...values,
      adable_id: adableId,
      ad_position_id: adPositionId,
    })
  })

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ad-title">{t('ads.form.title')}</Label>
          <Input id="ad-title" {...register('title')} />
          {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad-tier">{t('ads.form.tier')}</Label>
          <select
            id="ad-tier"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('tier')}
          >
            <option value="gold">{t('ads.tiers.gold')}</option>
            <option value="silver">{t('ads.tiers.silver')}</option>
            <option value="normal">{t('ads.tiers.normal')}</option>
          </select>
          {errors.tier ? <p className="text-sm text-destructive">{errors.tier.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ad-duration">{t('ads.form.duration')}</Label>
          <select
            id="ad-duration"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('duration_days', {
              setValueAs: (value) => Number(value),
            })}
          >
            {allowedDurations.map((duration) => (
              <option key={duration} value={duration}>
                {t('ads.form.durationOption', { count: duration })}
              </option>
            ))}
          </select>
          {errors.duration_days ? (
            <p className="text-sm text-destructive">{errors.duration_days.message}</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <p>
            {t('ads.form.pricePerDay', {
              price: pricePerDay?.toFixed(2) ?? '0.00',
            })}
          </p>
          <p className="mt-1 font-medium text-foreground">
            {t('ads.form.totalPrice', {
              price: totalPrice?.toFixed(2) ?? '0.00',
            })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ad-subtitle">{t('ads.form.subtitle')}</Label>
        <Textarea id="ad-subtitle" rows={3} {...register('subtitle')} />
        {errors.subtitle ? <p className="text-sm text-destructive">{errors.subtitle.message}</p> : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ad-target-type">{t('ads.form.targetType')}</Label>
          <select
            id="ad-target-type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('adable_type')}
          >
            {sellerProfile ? <option value="seller">{t('ads.targetType.seller')}</option> : null}
            {serviceProviderProfile ? (
              <option value="service_provider">{t('ads.targetType.service_provider')}</option>
            ) : null}
            {products.length ? <option value="product">{t('ads.targetType.product')}</option> : null}
            {services.length ? <option value="service">{t('ads.targetType.service')}</option> : null}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad-target">{t('ads.form.target')}</Label>
          <select
            id="ad-target"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={selectedType === 'seller' || selectedType === 'service_provider'}
            {...register('adable_id', {
              setValueAs: (value) => {
                if (value === '' || value === undefined) {
                  return null
                }

                return Number(value)
              },
            })}
          >
            <option value="">
              {selectedType === 'seller' || selectedType === 'service_provider'
                ? availableTargets[0]?.label ?? t('ads.form.targetUnavailable')
                : t('ads.form.selectTarget')}
            </option>
            {availableTargets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.label}
              </option>
            ))}
          </select>
          {errors.adable_id ? <p className="text-sm text-destructive">{errors.adable_id.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ad-images">{t('ads.form.images')}</Label>
        <Input id="ad-images" type="file" accept="image/*" multiple {...register('images')} />
        <p className="text-xs text-muted-foreground">{t('ads.form.imagesHint')}</p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('ads.creating') : t('ads.createAd')}
      </Button>
    </form>
  )
}
