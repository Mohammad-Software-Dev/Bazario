import { httpClient } from '@/lib/api/http-client'

import { connectEndpoints } from '@/features/connect/api/connect-endpoints'
import type {
  ConnectStatusResult,
  ConnectSummaryResult,
  StartConnectOnboardingResult,
} from '@/features/connect/types/connect.types'

export async function getConnectStatus() {
  const response = await httpClient.get<ConnectStatusResult>(connectEndpoints.status)

  return response.data
}

export async function startConnectOnboarding() {
  const response = await httpClient.post<StartConnectOnboardingResult>(connectEndpoints.onboard)

  return response.data
}

export async function getConnectSummary() {
  const response = await httpClient.get<ConnectSummaryResult>(connectEndpoints.summary)

  return response.data
}
