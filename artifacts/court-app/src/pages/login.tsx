import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { AlertCircle, Scale } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });

  // Get error from url
  const params = new URLSearchParams(window.location.search);
  const errorParam = params.get("error");
  
  let errorMessage = "";
  if (errorParam === "invalid_state") errorMessage = "Неверное состояние авторизации.";
  if (errorParam === "token_failed") errorMessage = "Не удалось получить токен.";
  if (errorParam === "server_error") errorMessage = "Ошибка сервера при авторизации.";

  useEffect(() => {
    if (user && user.approved) {
      setLocation("/app");
    }
  }, [user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, hsl(var(--primary)), transparent 60%)' }} />
      
      <Card className="w-full max-w-md border-border shadow-2xl bg-card z-10">
        <CardHeader className="text-center pb-8 border-b border-border/50">
          <div className="mx-auto bg-background p-4 rounded-full border border-border/50 mb-4 shadow-inner">
            <Scale className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif text-primary tracking-wider uppercase">Судебная коллегия Winslow</CardTitle>
          <CardDescription className="text-muted-foreground uppercase tracking-widest text-xs mt-2">
            Court of Law — State of Winslow
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 flex flex-col gap-6">
          {errorMessage && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка входа</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-center text-sm text-muted-foreground mb-2">
            Доступ разрешен только действующим сотрудникам судебной коллегии.
          </div>

          <a href="/api/auth/discord" className="w-full block">
            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide uppercase">
              Войти через Discord
            </Button>
          </a>
        </CardContent>
      </Card>
      
      <div className="mt-12 text-xs text-muted-foreground/50 tracking-widest uppercase font-serif">
        Authorized Personnel Only
      </div>
    </div>
  );
}
