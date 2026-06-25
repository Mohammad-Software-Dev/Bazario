import { createBrowserRouter } from 'react-router-dom'

import { HomePage } from '@/app/router/pages/home-page'
import { ProtectedRoute } from '@/app/router/protected-route'
import { MainLayout } from '@/layouts/main-layout'
import { AccountPage } from '@/features/account/pages/account-page'
import { SellerUpgradePage } from '@/features/account/pages/seller-upgrade-page'
import { ServiceProviderUpgradePage } from '@/features/account/pages/service-provider-upgrade-page'
import { RegisterPage } from '@/features/auth/pages/register-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
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
