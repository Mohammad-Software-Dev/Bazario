import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/app/router/protected-route'
import { AccountPage } from '@/features/account/pages/account-page'
import { SellerUpgradePage } from '@/features/account/pages/seller-upgrade-page'
import { ServiceProviderUpgradePage } from '@/features/account/pages/service-provider-upgrade-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { ConnectAccountPage } from '@/features/connect/pages/connect-account-page'
import { EarningsPage } from '@/features/earnings/pages/earnings-page'
import { CartPage } from '@/features/cart/pages/cart-page'
import { HomePage } from '@/features/home/pages/home-page'
import { BookingsPage } from '@/features/orders/pages/bookings-page'
import { CheckoutCancelPage } from '@/features/orders/pages/checkout-cancel-page'
import { CheckoutSuccessPage } from '@/features/orders/pages/checkout-success-page'
import { OrderDetailsPage } from '@/features/orders/pages/order-details-page'
import { OrdersPage } from '@/features/orders/pages/orders-page'
import { ProductDetailsPage } from '@/features/products/pages/product-details-page'
import { ProductEditorPage } from '@/features/products/pages/product-editor-page'
import { ProductsPage } from '@/features/products/pages/products-page'
import { SellerProductsManagementPage } from '@/features/products/pages/seller-products-management-page'
import { SellerProductsPage } from '@/features/products/pages/seller-products-page'
import { ProviderAvailabilityPage } from '@/features/provider-availability/pages/provider-availability-page'
import { SellersPage } from '@/features/sellers/pages/sellers-page'
import { ServiceDetailsPage } from '@/features/services/pages/service-details-page'
import { ProviderServicesPage } from '@/features/services/pages/provider-services-page'
import { ServiceEditorPage } from '@/features/services/pages/service-editor-page'
import { ServiceProviderServicesPage } from '@/features/services/pages/service-provider-services-page'
import { ServicesPage } from '@/features/services/pages/services-page'
import { ServiceProvidersPage } from '@/features/service-providers/pages/service-providers-page'
import { MainLayout } from '@/layouts/main-layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cart', element: <CartPage /> },
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
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <AccountPage />
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
    ],
  },
])
