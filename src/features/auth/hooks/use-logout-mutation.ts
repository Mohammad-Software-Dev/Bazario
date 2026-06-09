import { useMutation } from '@tanstack/react-query'

import { logout } from '@/features/auth/api/auth-api'
import { useAuth } from '@/lib/auth/use-auth'

export function useLogoutMutation() {
  const { clearSession } = useAuth()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession()
    },
  })
}
