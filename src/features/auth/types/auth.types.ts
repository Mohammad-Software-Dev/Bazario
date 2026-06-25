export type Role = 'customer' | 'seller' | 'service_provider' | 'admin'

export interface AvailableUpgrades {
  seller: boolean
  service_provider: boolean
}

export interface SellerProfile {
  id: number
  user_id: number
  store_owner_name: string
  store_name: string
  address: string
  logo: string | null
  description: string | null
  status: string
  created_at?: string
  updated_at?: string
}

export interface ServiceProviderProfile {
  id: number
  user_id: number
  name: string
  address: string
  logo: string | null
  description: string | null
  status: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  age: number | null
  roles?: Role[]
  seller_profile?: SellerProfile | null
  service_provider_profile?: ServiceProviderProfile | null
  available_upgrades?: AvailableUpgrades
  created_at?: string
  updated_at?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
  roles: Role[]
}

export interface RegisterPayload {
  name: string
  age: number | null
  email: string
  phone?: string
  password: string
  password_confirmation: string
}

export interface RegisterResult {
  token: string
  token_type: 'Bearer'
  user: User
  roles: Role[]
}

export interface AuthSession {
  token: string
  user: User
  roles: Role[]
}
