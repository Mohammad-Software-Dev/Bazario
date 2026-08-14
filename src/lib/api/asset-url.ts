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

  const normalized = path.startsWith('/') ? path.slice(1) : path
  const assetPath =
    normalized.startsWith('storage/') || normalized.startsWith('media/')
      ? normalized
      : `storage/${normalized}`

  return `${origin}/${assetPath}`
}

export function resolveMediaUrl(url: string | null | undefined, path?: string | null | undefined) {
  return buildAssetUrl(url) ?? buildAssetUrl(path)
}
