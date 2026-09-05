import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Without a catch-all route an unknown address falls through to the router's
// built-in error screen, which is written for developers and stays in English.
// This page keeps the user inside the layout and offers the next sensible step.
export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('notFound.eyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{t('notFound.title')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('notFound.cardTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">{t('notFound.description')}</p>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/">{t('notFound.backHome')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products">{t('notFound.browseProducts')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/services">{t('notFound.browseServices')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
