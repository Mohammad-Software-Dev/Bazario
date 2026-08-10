export const authEndpoints = {
  login: '/api/login',
  register: '/api/register',
  logout: '/api/logout',
  forgotPassword: '/api/password/forgot',
  verifyResetOtp: '/api/password/verify-otp',
  resetPassword: '/api/password/reset',
  updatePassword: '/api/update-password',
  deleteAccount: '/api/me',
} as const
