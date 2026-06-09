export type Role = 'customer' | 'seller' | 'service_provider' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  age: number | null
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
  phone: string | null
  password: string
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
