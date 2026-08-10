import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

const useLazyRoutes = import.meta.env.VITE_ENABLE_ROUTE_LAZY_LOADING === 'true'

let routes: RouteObject[]

if (useLazyRoutes) {
  const lazyModule = await import('@/app/router/routes-lazy')
  routes = lazyModule.lazyRoutes
} else {
  const eagerModule = await import('@/app/router/routes-eager')
  routes = eagerModule.eagerRoutes
}

export const router = createBrowserRouter(routes)
