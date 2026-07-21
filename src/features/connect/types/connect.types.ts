export interface ConnectAccountSnapshot {
  id?: number
  user_id?: number
  stripe_account_id: string
  type?: string | null
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  onboarding_completed_at?: string | null
  requirements?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
}

export interface ConnectBalanceRow {
  currency_iso: string
  amount: number
}

export interface ConnectTransferRecord {
  id: number
  order_id: number
  transfer_id: string
  amount: number
  currency_iso: string
  status: string
  created_at: string | null
}

export interface ConnectStatusResult {
  connected: boolean
  eligible: boolean
  eligible_type: string | null
  account: ConnectAccountSnapshot | null
}

export interface StartConnectOnboardingResult {
  onboarding_url: string
  expires_at: number
  eligible_type: string | null
  account: Pick<
    ConnectAccountSnapshot,
    'stripe_account_id' | 'charges_enabled' | 'payouts_enabled' | 'details_submitted'
  >
}

export interface ConnectSummaryResult {
  eligible: boolean
  eligible_type: string | null
  connected: boolean
  account: ConnectAccountSnapshot | null
  stripe_balance: {
    available: ConnectBalanceRow[]
    pending: ConnectBalanceRow[]
  }
  platform_pending_balance: ConnectBalanceRow[]
  transfers: ConnectTransferRecord[]
}
