import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/app/router/protected-route'
import { AccountPage } from '@/features/account/pages/account-page'
import { ChangePasswordPage } from '@/features/account/pages/change-password-page'
import { EditProfilePage } from '@/features/account/pages/edit-profile-page'
import { SellerUpgradePage } from '@/features/account/pages/seller-upgrade-page'
import { ServiceProviderUpgradePage } from '@/features/account/pages/service-provider-upgrade-page'
import { AccountAdsPage } from '@/features/ads/pages/account-ads-page'
import { AdCheckoutCancelPage } from '@/features/ads/pages/ad-checkout-cancel-page'
import { AdCheckoutSuccessPage } from '@/features/ads/pages/ad-checkout-success-page'
import { CreateAdPage } from '@/features/ads/pages/create-ad-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password-page'
import { ResetPasswordPage } from '@/features/auth/pages/reset-password-page'
import { VerifyResetOtpPage } from '@/features/auth/pages/verify-reset-otp-page'
import { CartPage } from '@/features/cart/pages/cart-page'
import { ChatPage } from '@/features/chat/pages/chat-page'
import { ConnectAccountPage } from '@/features/connect/pages/connect-account-page'
import { EarningsPage } from '@/features/earnings/pages/earnings-page'
import { HomePage } from '@/features/home/pages/home-page'
import { BookingReschedulePage } from '@/features/orders/pages/booking-reschedule-page'
import { BookingsPage } from '@/features/orders/pages/bookings-page'
import { CheckoutCancelPage } from '@/features/orders/pages/checkout-cancel-page'
import { CheckoutSuccessPage } from '@/features/orders/pages/checkout-success-page'
import { OrderDetailsPage } from '@/features/orders/pages/order-details-page'
import { OrdersPage } from '@/features/orders/pages/orders-page'
import { ProviderBookingsPage } from '@/features/orders/pages/provider-bookings-page'
import { ProductDetailsPage } from '@/features/products/pages/product-details-page'
import { ProductEditorPage } from '@/features/products/pages/product-editor-page'
import { ProductsPage } from '@/features/products/pages/products-page'
import { SellerProductsManagementPage } from '@/features/products/pages/seller-products-management-page'
import { SellerProductsPage } from '@/features/products/pages/seller-products-page'
import { ProviderAvailabilityPage } from '@/features/provider-availability/pages/provider-availability-page'
import { AccountListingsPage } from '@/features/listings/pages/account-listings-page'
import { ListingCheckoutCancelPage } from '@/features/listings/pages/listing-checkout-cancel-page'
import { ListingCheckoutSuccessPage } from '@/features/listings/pages/listing-checkout-success-page'
import { CreateListingPage } from '@/features/listings/pages/create-listing-page'
import { SellersPage } from '@/features/sellers/pages/sellers-page'
import { ServiceProvidersPage } from '@/features/service-providers/pages/service-providers-page'
import { ServiceDetailsPage } from '@/features/services/pages/service-details-page'
import { ServiceEditorPage } from '@/features/services/pages/service-editor-page'
import { ProviderServicesPage } from '@/features/services/pages/provider-services-page'
import { ServiceProviderServicesPage } from '@/features/services/pages/service-provider-services-page'
import { ServicesPage } from '@/features/services/pages/services-page'
import { MainLayout } from '@/layouts/main-layout'

export const eagerRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cart', element: <CartPage /> },
      {
        path: 'chat',
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat/:conversationId',
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/success',
        element: (
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/cancel',
        element: (
          <ProtectedRoute>
            <CheckoutCancelPage />
          </ProtectedRoute>
        ),
      },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:productId', element: <ProductDetailsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:serviceId', element: <ServiceDetailsPage /> },
      { path: 'sellers', element: <SellersPage /> },
      { path: 'sellers/:sellerId/products', element: <SellerProductsPage /> },
      { path: 'service-providers', element: <ServiceProvidersPage /> },
      {
        path: 'service-providers/:serviceProviderId/services',
        element: <ServiceProviderServicesPage />,
      },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'verify-reset-otp', element: <VerifyResetOtpPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/edit-profile',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/change-password',
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/orders',
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/orders/:orderId',
        element: (
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/bookings',
        element: (
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/bookings/:bookingId/reschedule',
        element: (
          <ProtectedRoute>
            <BookingReschedulePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/stripe',
        element: (
          <ProtectedRoute requiredRoles={['seller', 'service_provider']}>
            <ConnectAccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/earnings',
        element: (
          <ProtectedRoute requiredRoles={['seller', 'service_provider']}>
            <EarningsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/ads',
        element: (
          <ProtectedRoute requiredRoles={['seller', 'service_provider']}>
            <AccountAdsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/ads/new',
        element: (
          <ProtectedRoute requiredRoles={['seller', 'service_provider']}>
            <CreateAdPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/ads/checkout/success',
        element: (
          <ProtectedRoute requiredRoles={['seller', 'service_provider']}>
            <AdCheckoutSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/ads/checkout/cancel',
        element: (
          <ProtectedRoute requiredRoles={['seller', 'service_provider']}>
            <AdCheckoutCancelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/announcements',
        element: (
          <ProtectedRoute>
            <AccountListingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/announcements/new',
        element: (
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/announcements/checkout/success',
        element: (
          <ProtectedRoute>
            <ListingCheckoutSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/announcements/checkout/cancel',
        element: (
          <ProtectedRoute>
            <ListingCheckoutCancelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/upgrade/seller',
        element: (
          <ProtectedRoute requiredRoles={['customer']}>
            <SellerUpgradePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/upgrade/service-provider',
        element: (
          <ProtectedRoute requiredRoles={['customer']}>
            <ServiceProviderUpgradePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/seller/products',
        element: (
          <ProtectedRoute requiredRoles={['seller']}>
            <SellerProductsManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/seller/products/new',
        element: (
          <ProtectedRoute requiredRoles={['seller']}>
            <ProductEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/seller/products/:productId/edit',
        element: (
          <ProtectedRoute requiredRoles={['seller']}>
            <ProductEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/provider/services',
        element: (
          <ProtectedRoute requiredRoles={['service_provider']}>
            <ProviderServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/provider/services/new',
        element: (
          <ProtectedRoute requiredRoles={['service_provider']}>
            <ServiceEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/provider/services/:serviceId/edit',
        element: (
          <ProtectedRoute requiredRoles={['service_provider']}>
            <ServiceEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/provider/availability',
        element: (
          <ProtectedRoute requiredRoles={['service_provider']}>
            <ProviderAvailabilityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/provider/bookings',
        element: (
          <ProtectedRoute requiredRoles={['service_provider']}>
            <ProviderBookingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]
