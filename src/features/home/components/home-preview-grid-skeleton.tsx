import { Card, CardContent } from '@/components/ui/card'

function SectionHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-9 w-72 animate-pulse rounded-full bg-muted" />
    </div>
  )
}

function MarketplaceUpdateCardSkeleton() {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-sm">
      <div className="absolute inset-0 animate-pulse bg-muted" />
      <div className="absolute left-4 top-4 h-7 w-28 animate-pulse rounded-full bg-background/70" />
      <div className="absolute inset-x-4 bottom-4 space-y-2">
        <div className="h-7 w-4/5 animate-pulse rounded-full bg-background/70" />
        <div className="h-5 w-3/5 animate-pulse rounded-full bg-background/55" />
      </div>
    </div>
  )
}

function SponsoredAdCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card className={`rounded-2xl border-border/70 bg-background shadow-sm ${featured ? 'p-5' : 'p-4'}`}>
      <CardContent className="flex h-full flex-col gap-4 p-0">
        <div className={`animate-pulse rounded-2xl bg-muted ${featured ? 'aspect-[16/8]' : 'aspect-[16/9]'}`} />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="space-y-2">
            <div className={`h-8 animate-pulse rounded-full bg-muted ${featured ? 'w-3/5' : 'w-4/5'}`} />
            <div className="h-5 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewCardSkeleton({ warm = false }: { warm?: boolean }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-sm">
      <div className={`aspect-4/3 animate-pulse ${warm ? 'bg-amber-50' : 'bg-muted'}`} />
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-8 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-8 w-12 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="h-16 w-full animate-pulse rounded-2xl bg-muted" />
      </CardContent>
    </Card>
  )
}

export function HomePreviewGridSkeleton() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <SectionHeaderSkeleton />
        <div className="overflow-hidden">
          <div className="flex gap-4">
            <div className="w-[280px] shrink-0 md:w-[340px] lg:w-[380px]">
              <MarketplaceUpdateCardSkeleton />
            </div>
            <div className="w-[280px] shrink-0 md:w-[340px] lg:w-[380px]">
              <MarketplaceUpdateCardSkeleton />
            </div>
            <div className="w-[280px] shrink-0 opacity-60 md:w-[340px] lg:w-[380px]">
              <MarketplaceUpdateCardSkeleton />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeaderSkeleton />
        <div className="overflow-hidden">
          <div className="flex gap-4">
            <div className="basis-[92%] lg:basis-[84%]">
              <SponsoredAdCardSkeleton featured />
            </div>
            <div className="basis-[92%] lg:basis-[84%] opacity-60">
              <SponsoredAdCardSkeleton featured />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeaderSkeleton />
        <div className="overflow-hidden">
          <div className="flex gap-4">
            <div className="basis-[88%] md:basis-[46%]">
              <SponsoredAdCardSkeleton />
            </div>
            <div className="basis-[88%] md:basis-[46%]">
              <SponsoredAdCardSkeleton />
            </div>
            <div className="basis-[88%] md:basis-[46%] opacity-60">
              <SponsoredAdCardSkeleton />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeaderSkeleton />
        <div className="overflow-hidden">
          <div className="flex gap-4">
            <div className="basis-[84%] md:basis-[42%] xl:basis-[31%]">
              <SponsoredAdCardSkeleton />
            </div>
            <div className="basis-[84%] md:basis-[42%] xl:basis-[31%]">
              <SponsoredAdCardSkeleton />
            </div>
            <div className="basis-[84%] md:basis-[42%] xl:basis-[31%]">
              <SponsoredAdCardSkeleton />
            </div>
            <div className="basis-[84%] md:basis-[42%] xl:basis-[31%] opacity-60">
              <SponsoredAdCardSkeleton />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeaderSkeleton />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PreviewCardSkeleton key={`product-${index}`} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeaderSkeleton />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PreviewCardSkeleton key={`service-${index}`} warm />
          ))}
        </div>
      </section>
    </div>
  )
}
