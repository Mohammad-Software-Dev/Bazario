import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { getLocalizedValue } from '@/lib/localized-value'

import type { CategoryItem } from '@/features/categories/types/category.types'

interface CategoryFilterProps {
  categories: CategoryItem[]
  selectedCategoryId?: number
  onCategoryChange: (categoryId?: number) => void
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: CategoryFilterProps) {
  const { t } = useTranslation()

  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
      <div className="flex gap-2 whitespace-nowrap md:flex-wrap md:whitespace-normal">
      <Button
        type="button"
        variant={selectedCategoryId ? 'outline' : 'default'}
        className="shrink-0"
        onClick={() => onCategoryChange(undefined)}
      >
        {t('common.all')}
      </Button>

      {categories.map((category) => {
        const label = getLocalizedValue(category.name) || `${t('common.uncategorized')} ${category.id}`
        const isSelected = selectedCategoryId === category.id

        return (
          <Button
            key={category.id}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            className="shrink-0"
            onClick={() => onCategoryChange(category.id)}
          >
            {label}
          </Button>
        )
      })}
      </div>
    </div>
  )
}
