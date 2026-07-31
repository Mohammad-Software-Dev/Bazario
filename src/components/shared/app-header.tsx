import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation'
import { useCartCount } from '@/features/cart/hooks/use-cart'
import { useAuth } from '@/lib/auth/use-auth'
import { useAppLanguage } from '@/lib/i18n/use-app-language'
import { useUiStore } from '@/stores/ui-store'

const navigationItems = [
  { to: '/products', labelKey: 'common.products' },
  { to: '/services', labelKey: 'common.services' },
  { to: '/sellers', labelKey: 'common.sellers' },
  { to: '/service-providers', labelKey: 'common.serviceProviders' },
] as const

export function AppHeader() {
  const { t } = useTranslation()
  const { session, isAuthenticated } = useAuth()
  const logoutMutation = useLogoutMutation()
  const openLoginDialog = useUiStore((state) => state.openLoginDialog)
  const cartCount = useCartCount()
  const { language, changeLanguage } = useAppLanguage()

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Button asChild variant="ghost" className="px-2 text-lg font-semibold">
            <Link to="/">{t('common.appName')}</Link>
          </Button>

          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button key={item.to} asChild variant="ghost" className="px-3 text-sm">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border border-border/70 p-1">
            <Button
              type="button"
              variant={language === 'en' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2"
              onClick={() => changeLanguage('en')}
              aria-label={t('common.english')}
            >
              EN
            </Button>
            <Button
              type="button"
              variant={language === 'de' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2"
              onClick={() => changeLanguage('de')}
              aria-label={t('common.german')}
            >
              DE
            </Button>
          </div>

          <Button asChild variant="ghost" className="px-3">
            <Link to="/cart">
              {t('header.cart')}
              {cartCount ? (
                <span className="ml-2 rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>

          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" className="px-3">
                <Link to="/account">{session?.user.name ?? t('common.account')}</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logoutMutation.mutate()
                }}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? t('common.loggingOut') : t('common.logout')}
              </Button>
            </>
          ) : (
            <Button onClick={openLoginDialog}>{t('common.login')}</Button>
          )}
        </div>
      </div>
    </header>
  )
}
