import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface PaginationControlsProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationControlsProps) {
  const { t } = useTranslation()

  if (lastPage <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
      <p className="text-sm text-muted-foreground">
        {t('orders.pageIndicator', { current: currentPage, total: lastPage })}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          {t('common.previous')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  )
}
