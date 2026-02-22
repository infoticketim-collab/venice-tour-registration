import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple client-side password check
      // In production, this should be verified server-side
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "Yerevan2026!";
      
      if (password === adminPassword) {
        // Store authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminAuthTime", Date.now().toString());
        toast.success("התחברת בהצלחה");
        setLocation("/admin");
      } else {
        toast.error("סיסמה שגויה");
      }
    } catch (error) {
      toast.error("שגיאה בהתחברות");
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">כניסה לממשק ניהול</CardTitle>
          <CardDescription>הזן את הסיסמה לגישה לממשק הניהול</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הזן סיסמה"
                required
                disabled={isLoading}
                className="text-right"
                dir="rtl"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "מתחבר..." : "התחבר"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
