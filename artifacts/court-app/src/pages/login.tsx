import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    window.location.href = `${apiUrl}/api/auth/discord`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-2xl bg-card">
        <CardHeader className="text-center pb-8 border-b border-border/50">
          <div className="mx-auto bg-background p-4 rounded-full border border-border/50 mb-4 shadow-inner">
            <Scale className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif text-primary tracking-wider uppercase">Судебная коллегия Winslow</CardTitle>
          <CardDescription className="text-muted-foreground uppercase tracking-widest text-xs mt-2">
            Court of Law — State of Winslow
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide uppercase"
          >
            Войти через Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
