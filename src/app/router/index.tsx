import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/app/router/protected-route'
import { AccountPage } from '@/features/account/pages/account-page'
import { SellerUpgradePage } from '@/features/account/pages/seller-upgrade-page'
import { ServiceProviderUpgradePage } from '@/features/account/pages/service-provider-upgrade-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { HomePage } from '@/features/home/pages/home-page'
import { ProductDetailsPage } from '@/features/products/pages/product-details-page'
import { ProductsPage } from '@/features/products/pages/products-page'
import { SellerProductsPage } from '@/features/products/pages/seller-products-page'
import { SellersPage } from '@/features/sellers/pages/sellers-page'
import { ServiceDetailsPage } from '@/features/services/pages/service-details-page'
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
    ],
  },
])
