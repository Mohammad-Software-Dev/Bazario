import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { productFormSchema, type ProductFormValues } from '@/features/products/schemas/product-form-schema'
import type { ProductCategory, ProductListItem } from '@/features/products/types/product.types'
import { getLocalizedValue } from '@/lib/localized-value'

interface ProductFormProps {
  categories: ProductCategory[]
  initialProduct?: ProductListItem
  isCategoriesLoading?: boolean
  isSubmitting: boolean
  mode: 'create' | 'edit'
  onSubmit: (values: ProductFormValues) => void
}

export function ProductForm({
  categories,
  initialProduct,
  isCategoriesLoading = false,
  isSubmitting,
  mode,
  onSubmit,
}: ProductFormProps) {
  const { t } = useTranslation()
  const nameTranslations = initialProduct?.name_translations
  const descriptionTranslations = initialProduct?.description_translations
  const initialDescription = initialProduct?.description

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: {
        en: nameTranslations?.en ?? (typeof initialProduct?.name === 'string' ? initialProduct.name : ''),
        ar: nameTranslations?.ar ?? '',
      },
      description: {
        en: descriptionTranslations?.en ?? (typeof initialDescription === 'object' && initialDescription?.en ? initialDescription.en : ''),
        ar: descriptionTranslations?.ar ?? (typeof initialDescription === 'object' && initialDescription?.ar ? initialDescription.ar : ''),
      },
      category_id: initialProduct?.category_id ?? 0,
      price: initialProduct?.price ?? 0,
      images: null,
    },
  })

  useEffect(() => {
    reset({
      name: {
        en: nameTranslations?.en ?? (typeof initialProduct?.name === 'string' ? initialProduct.name : ''),
        ar: nameTranslations?.ar ?? '',
      },
      description: {
        en: descriptionTranslations?.en ?? (typeof initialDescription === 'object' && initialDescription?.en ? initialDescription.en : ''),
        ar: descriptionTranslations?.ar ?? (typeof initialDescription === 'object' && initialDescription?.ar ? initialDescription.ar : ''),
      },
      category_id: initialProduct?.category_id ?? 0,
      price: initialProduct?.price ?? 0,
      images: null,
    })
  }, [descriptionTranslations?.ar, descriptionTranslations?.en, initialDescription, initialProduct, nameTranslations?.ar, nameTranslations?.en, reset])

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-name-en">{t('productForm.nameEn')}</Label>
          <Input id="product-name-en" {...register('name.en')} />
          {errors.name?.en ? <p className="text-sm text-destructive">{errors.name.en.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-name-ar">{t('productForm.nameAr')}</Label>
          <Input id="product-name-ar" {...register('name.ar')} />
          {errors.name?.ar ? <p className="text-sm text-destructive">{errors.name.ar.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-description-en">{t('productForm.descriptionEn')}</Label>
          <Textarea id="product-description-en" rows={4} {...register('description.en')} />
          {errors.description?.en ? <p className="text-sm text-destructive">{errors.description.en.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-description-ar">{t('productForm.descriptionAr')}</Label>
          <Textarea id="product-description-ar" rows={4} {...register('description.ar')} />
          {errors.description?.ar ? <p className="text-sm text-destructive">{errors.description.ar.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-category">{t('productForm.category')}</Label>
          <select
            id="product-category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('category_id', { setValueAs: (value) => Number(value) })}
            disabled={isCategoriesLoading}
          >
            <option value={0}>{t('productForm.selectCategory')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {getLocalizedValue(category.name) ||
                  t('productForm.categoryFallback', { id: category.id })}
              </option>
            ))}
          </select>
          {errors.category_id ? <p className="text-sm text-destructive">{errors.category_id.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-price">{t('productForm.price')}</Label>
          <Input
            id="product-price"
            type="number"
            step="0.01"
            {...register('price', { setValueAs: (value) => Number(value) })}
          />
          {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="space-y-2">
          <Label htmlFor="product-images">{t('productForm.images')}</Label>
          <Input id="product-images" type="file" accept="image/*" multiple {...register('images')} />
          <p className="text-xs text-muted-foreground">
            {mode === 'edit'
              ? t('productForm.imagesReplaceHint')
              : t('productForm.imagesCreateHint')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting || isCategoriesLoading}>
          {isSubmitting
            ? t('common.saving')
            : mode === 'create'
              ? t('productForm.create')
              : t('productForm.saveChanges')}
        </Button>
      </div>
    </form>
  )
}
