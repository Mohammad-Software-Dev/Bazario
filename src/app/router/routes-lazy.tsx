import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/app/router/protected-route'
import type { Role } from '@/features/auth/types/auth.types'
import { HomePage } from '@/features/home/pages/home-page'
import { MainLayout } from '@/layouts/main-layout'

type PageModule = Record<string, ComponentType>

function lazyPage(importer: () => Promise<PageModule>, exportName: string): Pick<RouteObject, 'lazy'> {
  return {
    lazy: async () => {
      const module = await importer()

      return {
        Component: module[exportName],
      }
    },
  }
}

function lazyProtectedPage(
  importer: () => Promise<PageModule>,
  exportName: string,
  requiredRoles?: Role[],
): Pick<RouteObject, 'lazy'> {
  return {
    lazy: async () => {
      const module = await importer()
      const Page = module[exportName]

      return {
        Component: function ProtectedLazyPage() {
          return (
            <ProtectedRoute requiredRoles={requiredRoles}>
              <Page />
            </ProtectedRoute>
          )
        },
      }
    },
  }
}

export const lazyRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'cart',
        ...lazyPage(() => import('@/features/cart/pages/cart-page'), 'CartPage'),
      },
      {
        path: 'chat',
        ...lazyProtectedPage(() => import('@/features/chat/pages/chat-page'), 'ChatPage'),
      },
      {
        path: 'chat/:conversationId',
        ...lazyProtectedPage(() => import('@/features/chat/pages/chat-page'), 'ChatPage'),
      },
      {
        path: 'checkout/success',
        ...lazyProtectedPage(
          () => import('@/features/orders/pages/checkout-success-page'),
          'CheckoutSuccessPage',
        ),
      },
      {
        path: 'checkout/cancel',
        ...lazyProtectedPage(
          () => import('@/features/orders/pages/checkout-cancel-page'),
          'CheckoutCancelPage',
        ),
      },
      {
        path: 'products',
        ...lazyPage(() => import('@/features/products/pages/products-page'), 'ProductsPage'),
      },
      {
        path: 'products/:productId',
        ...lazyPage(() => import('@/features/products/pages/product-details-page'), 'ProductDetailsPage'),
      },
      {
        path: 'services',
        ...lazyPage(() => import('@/features/services/pages/services-page'), 'ServicesPage'),
      },
      {
        path: 'services/:serviceId',
        ...lazyPage(() => import('@/features/services/pages/service-details-page'), 'ServiceDetailsPage'),
      },
      {
        path: 'sellers',
        ...lazyPage(() => import('@/features/sellers/pages/sellers-page'), 'SellersPage'),
      },
      {
        path: 'sellers/:sellerId/products',
        ...lazyPage(() => import('@/features/products/pages/seller-products-page'), 'SellerProductsPage'),
      },
      {
        path: 'service-providers',
        ...lazyPage(() => import('@/features/service-providers/pages/service-providers-page'), 'ServiceProvidersPage'),
      },
      {
        path: 'service-providers/:serviceProviderId/services',
        ...lazyPage(
          () => import('@/features/services/pages/service-provider-services-page'),
          'ServiceProviderServicesPage',
        ),
      },
      {
        path: 'register',
        ...lazyPage(() => import('@/features/auth/pages/register-page'), 'RegisterPage'),
      },
      {
        path: 'forgot-password',
        ...lazyPage(() => import('@/features/auth/pages/forgot-password-page'), 'ForgotPasswordPage'),
      },
      {
        path: 'verify-reset-otp',
        ...lazyPage(() => import('@/features/auth/pages/verify-reset-otp-page'), 'VerifyResetOtpPage'),
      },
      {
        path: 'reset-password',
        ...lazyPage(() => import('@/features/auth/pages/reset-password-page'), 'ResetPasswordPage'),
      },
      {
        path: 'account',
        ...lazyProtectedPage(() => import('@/features/account/pages/account-page'), 'AccountPage'),
      },
      {
        path: 'account/edit-profile',
        ...lazyProtectedPage(() => import('@/features/account/pages/edit-profile-page'), 'EditProfilePage'),
      },
      {
        path: 'account/change-password',
        ...lazyProtectedPage(() => import('@/features/account/pages/change-password-page'), 'ChangePasswordPage'),
      },
      {
        path: 'account/orders',
        ...lazyProtectedPage(() => import('@/features/orders/pages/orders-page'), 'OrdersPage'),
      },
      {
        path: 'account/orders/:orderId',
        ...lazyProtectedPage(() => import('@/features/orders/pages/order-details-page'), 'OrderDetailsPage'),
      },
      {
        path: 'account/bookings',
        ...lazyProtectedPage(() => import('@/features/orders/pages/bookings-page'), 'BookingsPage'),
      },
      {
        path: 'account/bookings/:bookingId/reschedule',
        ...lazyProtectedPage(
          () => import('@/features/orders/pages/booking-reschedule-page'),
          'BookingReschedulePage',
        ),
      },
      {
        path: 'account/stripe',
        ...lazyProtectedPage(
          () => import('@/features/connect/pages/connect-account-page'),
          'ConnectAccountPage',
          ['seller', 'service_provider'],
        ),
      },
      {
        path: 'account/earnings',
        ...lazyProtectedPage(
          () => import('@/features/earnings/pages/earnings-page'),
          'EarningsPage',
          ['seller', 'service_provider'],
        ),
      },
      {
        path: 'account/ads',
        ...lazyProtectedPage(
          () => import('@/features/ads/pages/account-ads-page'),
          'AccountAdsPage',
          ['seller', 'service_provider'],
        ),
      },
      {
        path: 'account/ads/new',
        ...lazyProtectedPage(
          () => import('@/features/ads/pages/create-ad-page'),
          'CreateAdPage',
          ['seller', 'service_provider'],
        ),
      },
      {
        path: 'account/ads/checkout/success',
        ...lazyProtectedPage(
          () => import('@/features/ads/pages/ad-checkout-success-page'),
          'AdCheckoutSuccessPage',
          ['seller', 'service_provider'],
        ),
      },
      {
        path: 'account/ads/checkout/cancel',
        ...lazyProtectedPage(
          () => import('@/features/ads/pages/ad-checkout-cancel-page'),
          'AdCheckoutCancelPage',
          ['seller', 'service_provider'],
        ),
      },
      {
        path: 'account/announcements',
        ...lazyProtectedPage(
          () => import('@/features/listings/pages/account-listings-page'),
          'AccountListingsPage',
        ),
      },
      {
        path: 'account/announcements/new',
        ...lazyProtectedPage(
          () => import('@/features/listings/pages/create-listing-page'),
          'CreateListingPage',
        ),
      },
      {
        path: 'account/announcements/checkout/success',
        ...lazyProtectedPage(
          () => import('@/features/listings/pages/listing-checkout-success-page'),
          'ListingCheckoutSuccessPage',
        ),
      },
      {
        path: 'account/announcements/checkout/cancel',
        ...lazyProtectedPage(
          () => import('@/features/listings/pages/listing-checkout-cancel-page'),
          'ListingCheckoutCancelPage',
        ),
      },
      {
        path: 'account/upgrade/seller',
        ...lazyProtectedPage(
          () => import('@/features/account/pages/seller-upgrade-page'),
          'SellerUpgradePage',
          ['customer'],
        ),
      },
      {
        path: 'account/upgrade/service-provider',
        ...lazyProtectedPage(
          () => import('@/features/account/pages/service-provider-upgrade-page'),
          'ServiceProviderUpgradePage',
          ['customer'],
        ),
      },
      {
        path: 'account/seller/products',
        ...lazyProtectedPage(
          () => import('@/features/products/pages/seller-products-management-page'),
          'SellerProductsManagementPage',
          ['seller'],
        ),
      },
      {
        path: 'account/seller/products/new',
        ...lazyProtectedPage(
          () => import('@/features/products/pages/product-editor-page'),
          'ProductEditorPage',
          ['seller'],
        ),
      },
      {
        path: 'account/seller/products/:productId/edit',
        ...lazyProtectedPage(
          () => import('@/features/products/pages/product-editor-page'),
          'ProductEditorPage',
          ['seller'],
        ),
      },
      {
        path: 'account/provider/services',
        ...lazyProtectedPage(
          () => import('@/features/services/pages/provider-services-page'),
          'ProviderServicesPage',
          ['service_provider'],
        ),
      },
      {
        path: 'account/provider/services/new',
        ...lazyProtectedPage(
          () => import('@/features/services/pages/service-editor-page'),
          'ServiceEditorPage',
          ['service_provider'],
        ),
      },
      {
        path: 'account/provider/services/:serviceId/edit',
        ...lazyProtectedPage(
          () => import('@/features/services/pages/service-editor-page'),
          'ServiceEditorPage',
          ['service_provider'],
        ),
      },
      {
        path: 'account/provider/availability',
        ...lazyProtectedPage(
          () => import('@/features/provider-availability/pages/provider-availability-page'),
          'ProviderAvailabilityPage',
          ['service_provider'],
        ),
      },
      {
        path: 'account/provider/bookings',
        ...lazyProtectedPage(
          () => import('@/features/orders/pages/provider-bookings-page'),
          'ProviderBookingsPage',
          ['service_provider'],
        ),
      },
    ],
  },
]
