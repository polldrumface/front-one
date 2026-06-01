import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAuthStatus, useLogout, getGetAuthStatusQueryKey } from "@workspace/api-client-react";
import { Loader2, XCircle } from "lucide-react";

export default function Pending() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const logoutMutation = useLogout();

  // If no token, return to login
  useEffect(() => {
    if (!token) {
      setLocation("/");
    }
  }, [token, setLocation]);

  const { data: statusData } = useGetAuthStatus(
    { token: token || "" },
    {
      query: {
        enabled: !!token,
        refetchInterval: 3000,
        queryKey: getGetAuthStatusQueryKey({ token: token || "" }),
      }
    }
  );

  useEffect(() => {
    if (statusData?.status === "approved") {
      setLocation("/app");
    }
  }, [statusData, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary)), transparent 50%)' }} />
      
      <Card className="w-full max-w-md border-border shadow-2xl bg-card z-10">
        <CardHeader className="text-center border-b border-border/50 pb-6">
          <CardTitle className="text-2xl font-serif text-primary tracking-wider uppercase">Статус доступа</CardTitle>
          <CardDescription className="text-muted-foreground uppercase tracking-widest text-xs mt-2">
            Court of Law — State of Winslow
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 flex flex-col items-center gap-6">
          {!statusData || statusData.status === "pending" ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground">Ожидание одобрения...</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Ваша заявка на доступ находится на рассмотрении.
                  Пожалуйста, ожидайте решения администратора.
                </p>
              </div>
            </>
          ) : statusData.status === "rejected" ? (
            <>
              <XCircle className="w-12 h-12 text-destructive" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-destructive">В доступе отказано</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {statusData.message || "Администратор отклонил ваш запрос на доступ."}
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full mt-4">
                Вернуться на главную
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
