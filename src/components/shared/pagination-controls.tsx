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
  if (lastPage <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {lastPage}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
