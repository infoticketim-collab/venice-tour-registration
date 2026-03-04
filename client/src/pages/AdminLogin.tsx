import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();

  const adminLoginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => {
      toast.success("התחברת בהצלחה");
      setLocation("/admin");
    },
    onError: () => {
      toast.error("סיסמה שגויה");
      setPassword("");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    adminLoginMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
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
                disabled={adminLoginMutation.isPending}
                className="text-right"
                dir="rtl"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={adminLoginMutation.isPending}
            >
              {adminLoginMutation.isPending ? "מתחבר..." : "התחבר"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
