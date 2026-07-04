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
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={selectedCategoryId ? 'outline' : 'default'}
        onClick={() => onCategoryChange(undefined)}
      >
        All
      </Button>

      {categories.map((category) => {
        const label = getLocalizedValue(category.name) || `Category ${category.id}`
        const isSelected = selectedCategoryId === category.id

        return (
          <Button
            key={category.id}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category.id)}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
