import { MainLayout } from '@/layouts/main-layout'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/app/router/pages/home-page'
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
    ],
  },
])
