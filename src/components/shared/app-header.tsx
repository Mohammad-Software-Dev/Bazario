import { Menu, MessageCircle, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLogoutMutation } from "@/features/auth/hooks/use-logout-mutation";
import { useCartCount } from "@/features/cart/hooks/use-cart";
import { useChatUnreadCountQuery } from "@/features/chat/hooks/use-chat-unread-count-query";
import { useChatUnreadSubscription } from "@/features/chat/hooks/use-chat-unread-subscription";
import { useAuth } from "@/lib/auth/use-auth";
import { useAppLanguage } from "@/lib/i18n/use-app-language";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const navigationItems = [
  { to: "/products", labelKey: "common.products" },
  { to: "/services", labelKey: "common.services" },
  { to: "/sellers", labelKey: "common.sellers" },
  { to: "/service-providers", labelKey: "common.serviceProviders" },
] as const;

export function AppHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuth();
  const logoutMutation = useLogoutMutation();
  const openLoginDialog = useUiStore((state) => state.openLoginDialog);
  const isMobileNavOpen = useUiStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const cartCount = useCartCount();
  const { language, changeLanguage } = useAppLanguage();
  const unreadCountQuery = useChatUnreadCountQuery(isAuthenticated);
  const unreadConversationCount = unreadCountQuery.data?.result.total ?? 0;

  useChatUnreadSubscription(session?.user.id, isAuthenticated);

  function handleOpenChat() {
    setMobileNavOpen(false);

    if (!isAuthenticated) {
      openLoginDialog();
      return;
    }

    navigate("/chat");
  }

  function handleMobileLogin() {
    setMobileNavOpen(false);
    openLoginDialog();
  }

  function handleLogout() {
    setMobileNavOpen(false);
    logoutMutation.mutate();
  }

  function handleChangeLanguage(nextLanguage: "en" | "de") {
    changeLanguage(nextLanguage);
  }

  return (
    <header className="border-b border-primary/20 bg-foreground text-background shadow-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Button
            asChild
            variant="ghost"
            className="px-2 text-2xl font-semibold text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
          >
            <Link to="/">{t("common.appName")}</Link>
          </Button>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={t("header.primaryNavigation")}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.to}
                asChild
                variant="ghost"
                className="px-3 text-sm text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "text-primary-foreground" : "text-primary-foreground/78"
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              </Button>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center rounded-md border border-primary-foreground/16 bg-background/10 p-1">
            <Button
              type="button"
              variant={language === "en" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-2",
                language !== "en" &&
                  "text-primary-foreground hover:bg-background/10 hover:text-primary-foreground",
              )}
              onClick={() => changeLanguage("en")}
              aria-label={t("common.english")}
            >
              EN
            </Button>
            <Button
              type="button"
              variant={language === "de" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-2",
                language !== "de" &&
                  "text-primary-foreground hover:bg-background/10 hover:text-primary-foreground",
              )}
              onClick={() => changeLanguage("de")}
              aria-label={t("common.german")}
            >
              DE
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="px-3 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
            onClick={handleOpenChat}
          >
            <MessageCircle className="mr-2 size-4" />
            {t("header.chat")}
            {isAuthenticated && unreadConversationCount > 0 ? (
              <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {unreadConversationCount}
              </span>
            ) : null}
          </Button>

          <Button
            asChild
            variant="ghost"
            className="px-3 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
          >
            <Link to="/cart">
              <ShoppingCart className="mr-2 size-4" />
              {t("header.cart")}
              {cartCount ? (
                <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="px-3 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link to="/account">
                  {session?.user.name ?? t("common.account")}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-primary-foreground/18 bg-background text-foreground hover:bg-background/90"
                onClick={() => {
                  logoutMutation.mutate();
                }}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending
                  ? t("common.loggingOut")
                  : t("common.logout")}
              </Button>
            </>
          ) : (
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={openLoginDialog}
            >
              {t("common.login")}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
            onClick={handleOpenChat}
            aria-label={t("header.chat")}
          >
            <MessageCircle className="size-5" />
            {isAuthenticated && unreadConversationCount > 0 ? (
              <span className="absolute mt-[-1.25rem] ml-[1.25rem] rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {unreadConversationCount}
              </span>
            ) : null}
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
            aria-label={t("header.cart")}
          >
            <Link to="/cart">
              <ShoppingCart className="size-5" />
              {cartCount ? (
                <span className="absolute mt-[-1.25rem] ml-[1.25rem] rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
            onClick={() => setMobileNavOpen(true)}
            aria-label={t("header.openMenu")}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Dialog open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent className="top-0 right-0 left-auto h-full max-h-none w-[min(22rem,100%-1rem)] translate-x-0 translate-y-0 rounded-none border-l border-t-0 border-r-0 border-b-0 p-0">
          <DialogHeader className="border-b border-border/70 px-5 py-4">
            <DialogTitle>{t("header.menu")}</DialogTitle>
          </DialogHeader>

          <div className="flex h-full flex-col overflow-y-auto px-5 py-5">
            <nav
              className="space-y-1"
              aria-label={t("header.primaryNavigation")}
            >
              {navigationItems.map((item) => (
                <Button
                  key={item.to}
                  asChild
                  variant="ghost"
                  className="w-full justify-start px-3"
                >
                  <NavLink to={item.to} onClick={() => setMobileNavOpen(false)}>
                    {t(item.labelKey)}
                  </NavLink>
                </Button>
              ))}
            </nav>

            <div className="mt-6 space-y-3 border-t border-border/70 pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t("common.language")}
              </p>
              <div className="flex items-center rounded-md border border-border/70 p-1">
                <Button
                  type="button"
                  variant={language === "en" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 flex-1"
                  onClick={() => handleChangeLanguage("en")}
                  aria-label={t("common.english")}
                >
                  EN
                </Button>
                <Button
                  type="button"
                  variant={language === "de" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 flex-1"
                  onClick={() => handleChangeLanguage("de")}
                  aria-label={t("common.german")}
                >
                  DE
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-border/70 pt-6">
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start px-3"
                  >
                    <Link to="/account" onClick={() => setMobileNavOpen(false)}>
                      {session?.user.name ?? t("common.account")}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending
                      ? t("common.loggingOut")
                      : t("common.logout")}
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={handleMobileLogin}>
                  {t("common.login")}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
