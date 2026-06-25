import { resolveApiBaseUrl } from '@/lib/api/http-client'

export function buildAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const apiBaseUrl = resolveApiBaseUrl()
  const origin = new URL(apiBaseUrl).origin

  return path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`
}
