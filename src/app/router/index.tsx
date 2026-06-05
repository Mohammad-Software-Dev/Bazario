import { MainLayout } from '@/layouts/main-layout'
import { createBrowserRouter } from 'react-router-dom'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,children:[] },
])