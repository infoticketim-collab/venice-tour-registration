import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Check, X, Loader2, Calendar, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<number | null>(null);

  const { data: registrations, isLoading, refetch } = trpc.admin.getAllRegistrations.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const { data: inventoryStats } = trpc.admin.getInventoryStats.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const utils = trpc.useUtils();

  const approveMutation = trpc.admin.approveRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה אושרה בהצלחה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error) => {
      toast.error("שגיאה באישור ההרשמה", { description: error.message });
    },
  });

  const rejectMutation = trpc.admin.rejectRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה נדחתה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error) => {
      toast.error("שגיאה בדחיית ההרשמה", { description: error.message });
    },
  });

  const cancelMutation = trpc.admin.cancelRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה בוטלה");
      setCancelDialogOpen(false);
      setSelectedRegistrationId(null);
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error) => {
      toast.error("שגיאה בביטול ההרשמה", { description: error.message });
    },
  });

  const handleCancelClick = (registrationId: number) => {
    setSelectedRegistrationId(registrationId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedRegistrationId) {
      cancelMutation.mutate({ registrationId: selectedRegistrationId });
    }
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>נדרשת התחברות</CardTitle>
            <CardDescription>יש להתחבר כדי לגשת לממשק הניהול</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
              התחבר
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>אין הרשאה</CardTitle>
            <CardDescription>רק מנהלים יכולים לגשת לדף זה</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const pendingRegistrations = registrations?.filter(r => r.status === "pending") || [];
  const approvedRegistrations = registrations?.filter(r => r.status === "approved") || [];
  const rejectedRegistrations = registrations?.filter(r => r.status === "rejected") || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold">ממשק ניהול - סיורים בוונציה</h1>
          <p className="text-blue-100 mt-2">ניהול הרשמות ומלאי</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {inventoryStats?.map((stat) => (
            <Card key={stat.tour.id} className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {stat.tour.title}
                </CardTitle>
                <CardDescription>
                  {new Date(stat.tour.startDate).toLocaleDateString('he-IL')} - {new Date(stat.tour.endDate).toLocaleDateString('he-IL')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">מקומות פנויים</span>
                  <span className="text-2xl font-bold text-primary">{stat.availableSpots}/{stat.capacity}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-yellow-600">{stat.pending}</div>
                    <div className="text-muted-foreground">ממתינים</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">{stat.approved}</div>
                    <div className="text-muted-foreground">מאושרים</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">{stat.rejected}</div>
                    <div className="text-muted-foreground">נדחו</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending */}
          <Card className="card-shadow">
            <CardHeader className="bg-yellow-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                ממתינים לאישור ({pendingRegistrations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : pendingRegistrations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">אין הרשמות ממתינות</p>
              ) : (
                pendingRegistrations.map((reg) => (
                  <Card key={reg.id} className="border-2">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">#{reg.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {reg.participants[0]?.firstNameHe} {reg.participants[0]?.lastNameHe}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {reg.datePreference === "may_4_6" && "4-6 מאי"}
                          {reg.datePreference === "may_25_27" && "25-27 מאי"}
                          {reg.datePreference === "no_preference" && "אין העדפה"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{reg.participants[0]?.email}</p>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => approveMutation.mutate({ registrationId: reg.id })}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="w-4 h-4 ml-1" />
                          אשר
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => rejectMutation.mutate({ registrationId: reg.id })}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="w-4 h-4 ml-1" />
                          דחה
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Approved */}
          <Card className="card-shadow">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                מאושרים ({approvedRegistrations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : approvedRegistrations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">אין הרשמות מאושרות</p>
              ) : (
                approvedRegistrations.map((reg) => (
                  <Card key={reg.id} className="border-2 border-green-200">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">#{reg.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {reg.participants[0]?.firstNameHe} {reg.participants[0]?.lastNameHe}
                          </p>
                        </div>
                        <Badge className="bg-green-600 text-xs">מאושר</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{reg.participants[0]?.email}</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full mt-2"
                        onClick={() => handleCancelClick(reg.id)}
                        disabled={cancelMutation.isPending}
                      >
                        <X className="w-4 h-4 ml-1" />
                        בטל רישום
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Rejected */}
          <Card className="card-shadow">
            <CardHeader className="bg-red-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                נדחו ({rejectedRegistrations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : rejectedRegistrations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">אין הרשמות נדחות</p>
              ) : (
                rejectedRegistrations.map((reg) => (
                  <Card key={reg.id} className="border-2 border-red-200">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">#{reg.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {reg.participants[0]?.firstNameHe} {reg.participants[0]?.lastNameHe}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">נדחה</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{reg.participants[0]?.email}</p>
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-green-600 hover:bg-green-700"
                        onClick={() => approveMutation.mutate({ registrationId: reg.id })}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4 ml-1" />
                        אשר רישום
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תבטל את ההרשמה ותעביר אותה לרשימת הנדחים. המקום ישוחרר בחזרה למלאי.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              אישור ביטול
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
