import Pusher, { type Channel } from 'pusher-js'

import { getAuthToken } from '@/lib/auth/auth-storage'
import { resolveApiBaseUrl } from '@/lib/api/http-client'

let client: Pusher | null = null

function getPusherConfig() {
  const key = import.meta.env.VITE_PUSHER_KEY ?? '886ffa931b99f50946be'
  const cluster = import.meta.env.VITE_PUSHER_CLUSTER ?? 'mt1'

  if (!key) {
    return null
  }

  return { key, cluster }
}

function getBroadcastAuthEndpoint() {
  const baseUrl = resolveApiBaseUrl().replace(/\/+$/, '')
  return `${baseUrl}/broadcasting/auth`
}

export function getPusherClient() {
  const token = getAuthToken()
  const config = getPusherConfig()

  if (!token || !config) {
    return null
  }

  if (client) {
    return client
  }

  client = new Pusher(config.key, {
    cluster: config.cluster,
    authEndpoint: getBroadcastAuthEndpoint(),
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  return client
}

export function destroyPusherClient() {
  if (!client) {
    return
  }

  client.disconnect()
  client = null
}

export function subscribePrivateChannel(name: string, onSubscribed?: (channel: Channel) => void) {
  const pusher = getPusherClient()

  if (!pusher) {
    return null
  }

  const channel = pusher.subscribe(name)
  onSubscribed?.(channel)

  return channel
}

export function unsubscribePrivateChannel(name: string) {
  const pusher = getPusherClient()

  if (!pusher) {
    return
  }

  pusher.unsubscribe(name)
}
