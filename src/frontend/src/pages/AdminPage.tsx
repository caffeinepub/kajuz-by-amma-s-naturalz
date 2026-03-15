import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function AdminPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { actor } = useActor();
  const [checking, setChecking] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (identity && actor) {
      setChecking(true);
      actor
        .isCallerAdmin()
        .then((isAdmin) => {
          if (isAdmin) {
            navigate({ to: "/admin/dashboard" });
          } else {
            setAccessDenied(true);
          }
        })
        .catch(() => setAccessDenied(true))
        .finally(() => setChecking(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, actor, navigate]);

  if (isInitializing || checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <Card className="shadow-commodity">
        <CardHeader className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground">
            kajuz by Amma's Naturalz — Admin Panel
          </p>
        </CardHeader>
        <CardContent>
          {accessDenied ? (
            <Alert
              variant="destructive"
              className="mb-4"
              data-ocid="admin.error_state"
            >
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Access denied. Your account does not have admin privileges.
              </AlertDescription>
            </Alert>
          ) : null}

          {!identity ? (
            <Button
              className="w-full"
              size="lg"
              onClick={login}
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Logged in as:{" "}
                <code className="text-xs bg-muted p-1 rounded">
                  {identity.getPrincipal().toString().slice(0, 20)}...
                </code>
              </p>
              <Button variant="outline" className="w-full" onClick={clear}>
                Logout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
