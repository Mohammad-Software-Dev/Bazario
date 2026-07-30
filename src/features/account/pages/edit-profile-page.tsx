import { Card, CardContent } from '@/components/ui/card'
import { EditProfileForm } from '@/features/account/components/edit-profile-form'
import { useMeQuery } from '@/features/account/hooks/use-me-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function EditProfilePage() {
  const meQuery = useMeQuery(false)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Edit profile</h1>
        <p className="text-sm text-muted-foreground">Update your account details and keep your information current.</p>
      </div>

      {meQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading profile...</p> : null}

      {meQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(meQuery.error, 'Unable to load your profile right now.')}
          </CardContent>
        </Card>
      ) : null}

      {meQuery.data?.result.user ? <EditProfileForm user={meQuery.data.result.user} /> : null}
    </div>
  )
}
