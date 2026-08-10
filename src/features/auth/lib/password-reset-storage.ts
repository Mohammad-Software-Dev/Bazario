const RESET_EMAIL_KEY = 'bazario-reset-email'
const RESET_TOKEN_KEY = 'bazario-reset-token'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function getPasswordResetEmail() {
  if (!canUseStorage()) {
    return ''
  }

  return window.sessionStorage.getItem(RESET_EMAIL_KEY) ?? ''
}

export function setPasswordResetEmail(email: string) {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.setItem(RESET_EMAIL_KEY, email)
}

export function clearPasswordResetEmail() {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.removeItem(RESET_EMAIL_KEY)
}

export function getPasswordResetToken() {
  if (!canUseStorage()) {
    return ''
  }

  return window.sessionStorage.getItem(RESET_TOKEN_KEY) ?? ''
}

export function setPasswordResetToken(token: string) {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.setItem(RESET_TOKEN_KEY, token)
}

export function clearPasswordResetToken() {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.removeItem(RESET_TOKEN_KEY)
}

export function clearPasswordResetFlow() {
  clearPasswordResetEmail()
  clearPasswordResetToken()
}
