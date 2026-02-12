import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Check, X, Loader2, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type DateOption = "may_4_6" | "may_25_27";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<Record<number, DateOption>>({});

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
    onError: (error: any) => {
      toast.error("שגיאה באישור ההרשמה", { description: error.message });
    },
  });

  const assignAndApproveMutation = trpc.admin.assignDateAndApprove.useMutation({
    onSuccess: () => {
      toast.success("התאריך הוקצה וההרשמה אושרה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error: any) => {
      toast.error("שגיאה באישור ההרשמה", { description: error.message });
    },
  });

  const rejectMutation = trpc.admin.rejectRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה נדחתה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      toast.error("שגיאה בביטול ההרשמה", { description: error.message });
    },
  });

  const handleApprove = (registrationId: number, datePreference: string | null, assignedDate: string | null) => {
    if (datePreference === "no_preference" && !assignedDate) {
      const selectedDate = selectedDates[registrationId];
      if (!selectedDate) {
        toast.error("יש לבחור תאריך לפני אישור");
        return;
      }
      assignAndApproveMutation.mutate({ registrationId, assignedDate: selectedDate });
    } else {
      approveMutation.mutate({ registrationId });
    }
  };

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

  // Separate registrations by date
  const getEffectiveDate = (reg: any) => {
    if (reg.assignedDate) return reg.assignedDate;
    if (reg.datePreference === "no_preference") return null;
    return reg.datePreference;
  };

  const may4_6Registrations = registrations?.filter(r => getEffectiveDate(r) === "may_4_6") || [];
  const may25_27Registrations = registrations?.filter(r => getEffectiveDate(r) === "may_25_27") || [];
  const noPreferenceRegistrations = registrations?.filter(r => getEffectiveDate(r) === null) || [];

  const renderRegistrationCard = (reg: any, showDateSelector: boolean = false) => {
    const effectiveDate = getEffectiveDate(reg);
    const isPending = reg.status === "pending";
    const isApproved = reg.status === "approved";
    const isRejected = reg.status === "rejected";

    return (
      <Card key={reg.id} className={`border-2 ${isApproved ? 'border-green-200' : isRejected ? 'border-red-200' : ''}`}>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">#{reg.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {reg.participants[0]?.firstNameHe} {reg.participants[0]?.lastNameHe}
              </p>
            </div>
            {isApproved && <Badge className="bg-green-600 text-xs">מאושר</Badge>}
            {isRejected && <Badge variant="destructive" className="text-xs">נדחה</Badge>}
            {isPending && showDateSelector && (
              <Badge variant="outline" className="text-xs">אין העדפה</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{reg.participants[0]?.email}</p>
          <p className="text-xs text-muted-foreground">{reg.participants[0]?.phone}</p>
          
          {isPending && showDateSelector && (
            <div className="pt-2">
              <Select
                value={selectedDates[reg.id] || ""}
                onValueChange={(value) => setSelectedDates({ ...selectedDates, [reg.id]: value as DateOption })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר תאריך" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="may_4_6">4-6 במאי</SelectItem>
                  <SelectItem value="may_25_27">25-27 במאי</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {isPending && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(reg.id, reg.datePreference, reg.assignedDate)}
                disabled={approveMutation.isPending || assignAndApproveMutation.isPending}
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
          )}
          
          {isApproved && (
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
          )}
          
          {isRejected && (
            <Button
              size="sm"
              className="w-full mt-2 bg-green-600 hover:bg-green-700"
              onClick={() => approveMutation.mutate({ registrationId: reg.id })}
              disabled={approveMutation.isPending}
            >
              <Check className="w-4 h-4 ml-1" />
              אשר רישום
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderDateSection = (title: string, dateKey: DateOption, registrations: any[]) => {
    const pending = registrations.filter(r => r.status === "pending");
    const approved = registrations.filter(r => r.status === "approved");
    const rejected = registrations.filter(r => r.status === "rejected");

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">{title}</h2>
          <Badge variant="outline" className="text-sm">
            {approved.length} מאושרים / 32 מקומות
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending */}
          <Card className="card-shadow">
            <CardHeader className="bg-yellow-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                ממתינים ({pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {pending.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">אין הרשמות ממתינות</p>
              ) : (
                pending.map(reg => renderRegistrationCard(reg))
              )}
            </CardContent>
          </Card>

          {/* Approved */}
          <Card className="card-shadow">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                מאושרים ({approved.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {approved.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">אין הרשמות מאושרות</p>
              ) : (
                approved.map(reg => renderRegistrationCard(reg))
              )}
            </CardContent>
          </Card>

          {/* Rejected */}
          <Card className="card-shadow">
            <CardHeader className="bg-red-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                נדחו ({rejected.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {rejected.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">אין הרשמות נדחות</p>
              ) : (
                rejected.map(reg => renderRegistrationCard(reg))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold">ממשק ניהול - סיורים בוונציה</h1>
          <p className="text-blue-100 mt-2">ניהול הרשמות לפי תאריכים</p>
        </div>
      </div>

      <div className="container py-8 space-y-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* No Preference Section - Shows first */}
            {noPreferenceRegistrations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">ללא העדפת תאריך</h2>
                  <Badge variant="outline" className="text-sm bg-orange-50">
                    דורש הקצאת תאריך
                  </Badge>
                </div>
                <Card className="card-shadow">
                  <CardHeader className="bg-orange-50 border-b">
                    <CardTitle className="text-lg">נרשמים שלא ציינו העדפת תאריך ({noPreferenceRegistrations.length})</CardTitle>
                    <CardDescription>יש לבחור תאריך לפני אישור ההרשמה</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {noPreferenceRegistrations.map(reg => renderRegistrationCard(reg, true))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* May 4-6 Section */}
            {renderDateSection("4-6 במאי 2026", "may_4_6", may4_6Registrations)}

            {/* May 25-27 Section */}
            {renderDateSection("25-27 במאי 2026", "may_25_27", may25_27Registrations)}
          </>
        )}
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
