import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useLogoutMutation } from "@/features/auth/hooks/use-logout-mutation";
import { useAuth } from "@/lib/auth/use-auth";

export function AppHeader() {
  const { session, isAuthenticated } = useAuth();
  const logoutMutation = useLogoutMutation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-background">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4">
          <div>
            <h1 className="text-lg font-semibold">Bazario</h1>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {session?.user.name ?? "Authenticated user"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  logoutMutation.mutate();
                }}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
          )}
        </div>
      </header>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
